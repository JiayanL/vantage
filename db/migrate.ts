import { Pool } from "pg";
import { readdir, readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    // Ensure the ledger table exists (idempotent)
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        filename   TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const { rows: applied } = await client.query(
      "SELECT filename FROM _migrations ORDER BY filename"
    );
    const alreadyRan = new Set(applied.map((r: { filename: string }) => r.filename));

    const dir = join(dirname(fileURLToPath(import.meta.url)), "migrations");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

    for (const file of files) {
      if (alreadyRan.has(file)) {
        console.log(`skip  ${file}`);
        continue;
      }
      const sql = await readFile(join(dir, file), "utf-8");
      console.log(`run   ${file}`);
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO _migrations (filename) VALUES ($1)",
        [file]
      );
      await client.query("COMMIT");
    }

    console.log("migrations up to date");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
