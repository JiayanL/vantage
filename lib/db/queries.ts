import pool from "@/lib/db"
import type { ArtifactRow } from "@/lib/types/artifact"

export async function getAllArtifacts(): Promise<ArtifactRow[]> {
  const { rows } = await pool.query(
    `SELECT
       a.id,
       a.role_family_id,
       rf.name AS role_family_name,
       a.artifact_type,
       a.title,
       a.source_ref,
       a.content,
       a.captured_at,
       a.created_at
     FROM artifact a
     JOIN role_family rf ON rf.id = a.role_family_id
     ORDER BY a.captured_at DESC NULLS LAST, a.created_at DESC`
  )

  return rows.map((row: Record<string, unknown>) => ({
    ...row,
    captured_at: row.captured_at
      ? (row.captured_at as Date).toISOString()
      : null,
    created_at: (row.created_at as Date).toISOString(),
  })) as ArtifactRow[]
}
