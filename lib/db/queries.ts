import pool from "@/lib/db"
import type { ArtifactRow } from "@/lib/types/artifact"
import type { DashboardStats } from "@/lib/types/dashboard"

export async function getDashboardStats(): Promise<DashboardStats> {
  const { rows } = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM artifact) AS total_artifacts,
      (SELECT COUNT(*) FROM artifact WHERE artifact_type = 'transcript') AS interviews_processed,
      (SELECT COUNT(*) FROM role_family WHERE status = 'active') AS active_role_families,
      (SELECT COUNT(*) FROM hiring_recommendation WHERE status = 'active') AS active_recommendations,
      (SELECT COUNT(*) FROM hiring_recommendation WHERE status = 'active' AND priority IN ('high', 'critical')) AS high_priority_count
  `)

  const row = rows[0]
  return {
    totalArtifacts: Number(row.total_artifacts),
    interviewsProcessed: Number(row.interviews_processed),
    activeRoleFamilies: Number(row.active_role_families),
    activeRecommendations: Number(row.active_recommendations),
    highPriorityCount: Number(row.high_priority_count),
  }
}

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
