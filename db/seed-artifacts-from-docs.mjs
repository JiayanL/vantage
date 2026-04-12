import { existsSync } from "fs";
import { readdir, readFile, stat } from "fs/promises";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectDir = dirname(__dirname);
const repoRoot = join(projectDir, "..", "..");

const ROLE_FAMILY_NAMES = ["Applied AI", "Research", "Go To Market"];
const dryRun = process.argv.includes("--dry-run");

function parseDotenvValue(raw, key) {
  const match = raw.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

async function walkMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkMarkdownFiles(fullPath);
      }
      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [fullPath];
      }
      return [];
    })
  );

  return files.flat().sort();
}

function inferRoleFamily(relPath) {
  if (relPath.includes("/applied-ai/") || relPath.includes("applied-ai-scorecard-sheet")) {
    return "Applied AI";
  }
  if (relPath.includes("/research/") || relPath.includes("research-scorecard-sheet")) {
    return "Research";
  }
  if (
    relPath.includes("/go-to-market/") ||
    relPath.includes("go-to-market-scorecard-sheet")
  ) {
    return "Go To Market";
  }

  throw new Error(`Unable to infer role family from ${relPath}`);
}

function inferArtifactType(relPath) {
  if (relPath.startsWith("docs/scorecards/")) {
    return "rubric";
  }
  if (relPath.endsWith("-transcript.md")) {
    return "transcript";
  }
  if (relPath.endsWith("-rubric.md")) {
    return "scorecard";
  }

  throw new Error(`Unable to infer artifact type from ${relPath}`);
}

function inferSourceRef(relPath) {
  const pdfRef = relPath.replace(/\.md$/, ".pdf");
  return existsSync(join(repoRoot, pdfRef)) ? pdfRef : relPath;
}

function extractTitle(markdown, fallback) {
  const heading = markdown
    .split(/\r?\n/)
    .find((line) => line.startsWith("# "));

  return heading ? heading.slice(2).trim() : fallback;
}

async function ensureRoleFamilies(client) {
  const { rows } = await client.query(
    "SELECT id, name FROM role_family WHERE name = ANY($1::text[])",
    [ROLE_FAMILY_NAMES]
  );

  const roleFamilyIds = new Map(rows.map((row) => [row.name, row.id]));

  for (const name of ROLE_FAMILY_NAMES) {
    if (roleFamilyIds.has(name)) {
      continue;
    }

    const insert = await client.query(
      "INSERT INTO role_family (name) VALUES ($1) RETURNING id, name",
      [name]
    );
    roleFamilyIds.set(insert.rows[0].name, insert.rows[0].id);
  }

  return roleFamilyIds;
}

async function buildArtifacts() {
  const docDirs = [
    join(repoRoot, "docs", "scorecards"),
    join(repoRoot, "docs", "synthetic-evals"),
  ];
  const markdownFiles = (
    await Promise.all(docDirs.map((dir) => walkMarkdownFiles(dir)))
  )
    .flat()
    .sort();

  return Promise.all(
    markdownFiles.map(async (filePath) => {
      const relPath = relative(repoRoot, filePath).replaceAll("\\", "/");
      const markdown = await readFile(filePath, "utf8");
      const fileStats = await stat(filePath);

      return {
        roleFamily: inferRoleFamily(relPath),
        artifactType: inferArtifactType(relPath),
        title: extractTitle(markdown, relPath.split("/").pop()?.replace(/\.md$/, "") ?? relPath),
        sourceRef: inferSourceRef(relPath),
        content: markdown,
        capturedAt: fileStats.mtime.toISOString(),
      };
    })
  );
}

async function main() {
  const envText = await readFile(join(projectDir, ".env"), "utf8");
  const connectionString = process.env.DATABASE_URL || parseDotenvValue(envText, "DATABASE_URL");

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const artifacts = await buildArtifacts();
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const roleFamilyIds = await ensureRoleFamilies(client);
    const sourceRefs = artifacts.map((artifact) => artifact.sourceRef);
    const existingResult = await client.query(
      "SELECT source_ref FROM artifact WHERE source_ref = ANY($1::text[])",
      [sourceRefs]
    );
    const existingSourceRefs = new Set(
      existingResult.rows.map((row) => row.source_ref)
    );

    let inserted = 0;
    let skipped = 0;

    for (const artifact of artifacts) {
      if (existingSourceRefs.has(artifact.sourceRef)) {
        skipped += 1;
        continue;
      }

      if (!dryRun) {
        await client.query(
          `INSERT INTO artifact (
            role_family_id,
            artifact_type,
            title,
            source_ref,
            content,
            captured_at
          ) VALUES ($1, $2::artifact_type, $3, $4, $5, $6::timestamptz)`,
          [
            roleFamilyIds.get(artifact.roleFamily),
            artifact.artifactType,
            artifact.title,
            artifact.sourceRef,
            artifact.content,
            artifact.capturedAt,
          ]
        );
      }

      inserted += 1;
    }

    if (dryRun) {
      await client.query("ROLLBACK");
    } else {
      await client.query("COMMIT");
    }

    const summary = artifacts.reduce((acc, artifact) => {
      const key = `${artifact.roleFamily}:${artifact.artifactType}`;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    console.log(
      JSON.stringify(
        {
          dryRun,
          totalArtifactsDiscovered: artifacts.length,
          inserted,
          skipped,
          summary,
        },
        null,
        2
      )
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
