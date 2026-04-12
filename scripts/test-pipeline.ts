import { readFileSync } from "fs";
import { resolve } from "path";
import { Pool } from "pg";

// Load .env since we're running outside Next.js — must run before any module
// that reads DATABASE_URL at import time (e.g. lib/db.ts pool singleton).
const envPath = resolve(import.meta.dirname ?? __dirname, "..", ".env");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });

async function main() {
  // Dynamic import so lib/db pool picks up DATABASE_URL set above
  const { regenerateForRoleFamily } = await import(
    "../lib/pipeline/regenerate"
  );

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

  const roleFamily = roleFamilyResult.rows[0] as { id: string; name: string };

  console.log(`Role family: ${roleFamily.name} (${roleFamily.id})`);
  console.log("\nRunning regeneration pipeline...\n");

  const start = Date.now();
  const result = await regenerateForRoleFamily(roleFamily);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`Completed in ${elapsed}s\n`);
  console.log("=== NEW RECOMMENDATION ===");
  console.log(`ID:         ${result.id}`);
  console.log(`Priority:   ${result.priority}`);
  console.log(`Confidence: ${result.confidence}`);
  console.log(`Cap label:  ${result.confidence_label ?? "(none)"}`);
  console.log(`Status:     ${result.status}`);
  console.log(`Headline:   ${result.headline}`);
  console.log(`\nKey Signals:`);
  result.key_signals.forEach((s: string, i: number) =>
    console.log(`  ${i + 1}. ${s}`)
  );
  console.log(`\nReasoning Summary:`);
  console.log(result.reasoning_summary);
  console.log(
    `\nSupporting Evidence (${result.supporting_evidence.length} items):`
  );
  result.supporting_evidence.forEach(
    (e: { artifact_id: string; quote: string; locator_hint: string }) => {
      console.log(`  [${e.artifact_id}] "${e.quote}" — ${e.locator_hint}`);
    }
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => pool.end());
