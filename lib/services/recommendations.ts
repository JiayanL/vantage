import pool from "@/lib/db"
import type { ArtifactRow, ArtifactType } from "@/lib/types/artifact"
import {
  toRecommendationRow,
  type Priority,
  type RecStatus,
  type RecommendationRow,
  type RoleFamilyRow,
} from "@/lib/types/recommendation"
import { regenerateForRoleFamily } from "@/lib/pipeline/regenerate"

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

const REC_SELECT = `
  SELECT
    hr.id,
    hr.role_family_id,
    rf.name AS role_family_name,
    hr.priority,
    hr.confidence,
    hr.confidence_label,
    hr.issue_type,
    hr.recommended_action,
    hr.headline,
    hr.key_signals_json,
    hr.reasoning_summary,
    hr.supporting_evidence_json,
    hr.draft_rubric_json,
    hr.draft_guidance_json,
    hr.raw_model_output_json,
    hr.generated_at,
    hr.status
  FROM hiring_recommendation hr
  JOIN role_family rf ON rf.id = hr.role_family_id`

type ListRecommendationsFilters = {
  role_family_id?: string
  status?: RecStatus
  priority?: Priority
  limit?: number
}

export async function listRecommendations(
  filters: ListRecommendationsFilters = {}
): Promise<RecommendationRow[]> {
  const conditions: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (filters.role_family_id) {
    conditions.push(`hr.role_family_id = $${idx++}`)
    params.push(filters.role_family_id)
  }
  if (filters.status) {
    conditions.push(`hr.status = $${idx++}`)
    params.push(filters.status)
  }
  if (filters.priority) {
    conditions.push(`hr.priority = $${idx++}`)
    params.push(filters.priority)
  }

  const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : ""
  let query = `${REC_SELECT}${where} ORDER BY hr.generated_at DESC`

  if (filters.limit) {
    query += ` LIMIT $${idx}`
    params.push(filters.limit)
  }

  const { rows } = await pool.query(query, params)
  return rows.map((r: Record<string, unknown>) => toRecommendationRow(r))
}

export async function getRecommendationDetail(
  id: string
): Promise<RecommendationRow | null> {
  const { rows } = await pool.query(`${REC_SELECT} WHERE hr.id = $1`, [id])
  if (rows.length === 0) return null
  return toRecommendationRow(rows[0] as Record<string, unknown>)
}

// ---------------------------------------------------------------------------
// Role families
// ---------------------------------------------------------------------------

export async function listRoleFamilies(): Promise<RoleFamilyRow[]> {
  const { rows } = await pool.query(
    `SELECT id, name, description, status, metadata_json, created_at
     FROM role_family
     ORDER BY name`
  )

  return rows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    status: row.status as string,
    metadata_json: row.metadata_json ?? null,
    created_at: (row.created_at as Date).toISOString(),
  }))
}

export async function getRoleFamilyArtifacts(
  roleFamilyId: string
): Promise<ArtifactRow[]> {
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
     WHERE a.role_family_id = $1
     ORDER BY a.captured_at DESC NULLS LAST, a.created_at DESC`,
    [roleFamilyId]
  )

  return rows.map((row: Record<string, unknown>) => ({
    ...row,
    captured_at: row.captured_at
      ? (row.captured_at as Date).toISOString()
      : null,
    created_at: (row.created_at as Date).toISOString(),
  })) as ArtifactRow[]
}

// ---------------------------------------------------------------------------
// Regeneration
// ---------------------------------------------------------------------------

export async function regenerateRoleFamily(
  roleFamilyId: string
): Promise<RecommendationRow> {
  const { rows } = await pool.query(
    `SELECT id, name FROM role_family WHERE id = $1`,
    [roleFamilyId]
  )

  if (rows.length === 0) {
    throw new Error(`Role family not found: ${roleFamilyId}`)
  }

  return regenerateForRoleFamily(rows[0] as { id: string; name: string })
}

export async function regenerateAll(): Promise<RecommendationRow[]> {
  const { rows: families } = await pool.query(
    `SELECT id, name FROM role_family WHERE status = 'active' ORDER BY name`
  )

  const results: RecommendationRow[] = []

  for (const family of families) {
    try {
      const rec = await regenerateForRoleFamily(
        family as { id: string; name: string }
      )
      results.push(rec)
    } catch (err) {
      console.error(
        `Failed to regenerate for "${(family as { name: string }).name}":`,
        err
      )
    }
  }

  return results
}

// ---------------------------------------------------------------------------
// Artifacts
// ---------------------------------------------------------------------------

type CreateArtifactInput = {
  role_family_id: string
  artifact_type: ArtifactType
  title: string
  source_ref?: string | null
  content?: string | null
  captured_at?: string | null
}

export async function createArtifact(
  input: CreateArtifactInput
): Promise<ArtifactRow> {
  const { rows } = await pool.query(
    `WITH inserted AS (
       INSERT INTO artifact (role_family_id, artifact_type, title, source_ref, content, captured_at)
       VALUES ($1, $2::artifact_type, $3, $4, $5, $6::timestamptz)
       RETURNING *
     )
     SELECT
       i.id,
       i.role_family_id,
       rf.name AS role_family_name,
       i.artifact_type,
       i.title,
       i.source_ref,
       i.content,
       i.captured_at,
       i.created_at
     FROM inserted i
     JOIN role_family rf ON rf.id = i.role_family_id`,
    [
      input.role_family_id,
      input.artifact_type,
      input.title,
      input.source_ref ?? null,
      input.content ?? null,
      input.captured_at ?? null,
    ]
  )

  const row = rows[0] as Record<string, unknown>
  return {
    ...row,
    captured_at: row.captured_at
      ? (row.captured_at as Date).toISOString()
      : null,
    created_at: (row.created_at as Date).toISOString(),
  } as ArtifactRow
}
