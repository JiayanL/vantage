import { readFileSync } from "fs";
import { resolve } from "path";
import { Pool } from "pg";

// Load .env since we're running outside Next.js
const envPath = resolve(import.meta.dirname ?? __dirname, "..", ".env");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
}

import { generateRecommendation } from "../lib/llm/index";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });

async function main() {
  const targetName = process.argv[2];

  const roleFamilyResult = targetName
    ? await pool.query(
        "SELECT id, name FROM role_family WHERE name = $1 LIMIT 1",
        [targetName]
      )
    : await pool.query(
        "SELECT id, name FROM role_family ORDER BY created_at LIMIT 1"
      );

  if (roleFamilyResult.rows.length === 0) {
    console.error(
      targetName
        ? `No role family found with name "${targetName}".`
        : "No role families found. Run the seed script first."
    );
    process.exit(1);
  }

  const roleFamily = roleFamilyResult.rows[0];

  const artifactResult = await pool.query(
    "SELECT id, artifact_type, title, content, source_ref FROM artifact WHERE role_family_id = $1",
    [roleFamily.id]
  );

  const types: Record<string, number> = {};
  for (const a of artifactResult.rows) {
    types[a.artifact_type] = (types[a.artifact_type] ?? 0) + 1;
  }

  console.log(`Role family: ${roleFamily.name} (${roleFamily.id})`);
  console.log(
    `Artifacts: ${artifactResult.rows.length} — ${Object.entries(types)
      .map(([t, n]) => `${n} ${t}`)
      .join(", ")}`
  );
  console.log("\nCalling generateRecommendation...\n");

  const start = Date.now();
  const { parsed, raw } = await generateRecommendation(
    roleFamily,
    artifactResult.rows
  );
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`Completed in ${elapsed}s\n`);
  console.log("=== PARSED OUTPUT ===");
  console.log(JSON.stringify(parsed, null, 2));

  const usage = (raw as Record<string, unknown>)?.usage as
    | { prompt_tokens: number; completion_tokens: number; total_tokens: number }
    | undefined;
  if (usage) {
    console.log("\n=== TOKEN USAGE ===");
    console.log(`Prompt:     ${usage.prompt_tokens}`);
    console.log(`Completion: ${usage.completion_tokens}`);
    console.log(`Total:      ${usage.total_tokens}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => pool.end());
