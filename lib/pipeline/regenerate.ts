import pool from "@/lib/db"
import { generateRecommendation } from "@/lib/llm"
import {
  toRecommendationRow,
  type RecommendationRow,
} from "@/lib/types/recommendation"

type RoleFamily = {
  id: string
  name: string
}

// ---------------------------------------------------------------------------
// Confidence cap — server-side safety net
// ---------------------------------------------------------------------------

function applyConfidenceCap(
  confidence: number,
  artifacts: { artifact_type: string }[]
): { confidence: number; label: string | null } {
  const distinctTypes = new Set(
    artifacts.map((a) => a.artifact_type.toLowerCase())
  )

  if (artifacts.length < 3) {
    return {
      confidence: Math.min(confidence, 0.5),
      label: `Capped at 0.5: only ${artifacts.length} artifact(s) available`,
    }
  }

  if (distinctTypes.size < 2) {
    return {
      confidence: Math.min(confidence, 0.6),
      label: `Capped at 0.6: only ${distinctTypes.size} source type(s) (${[...distinctTypes].join(", ")})`,
    }
  }

  return { confidence, label: null }
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

export async function regenerateForRoleFamily(
  roleFamily: RoleFamily
): Promise<RecommendationRow> {
  // 1. Load artifacts
  const { rows: artifacts } = await pool.query(
    `SELECT id, artifact_type, title, content, source_ref
     FROM artifact
     WHERE role_family_id = $1`,
    [roleFamily.id]
  )

  // 2. Call LLM
  const { parsed, raw } = await generateRecommendation(roleFamily, artifacts)

  // 3. Apply confidence cap
  const cap = applyConfidenceCap(parsed.confidence, artifacts)

  // 4. Transaction: supersede old + insert new
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    await client.query(
      `UPDATE hiring_recommendation
       SET status = 'superseded'
       WHERE role_family_id = $1 AND status = 'active'`,
      [roleFamily.id]
    )

    const { rows } = await client.query(
      `WITH inserted AS (
         INSERT INTO hiring_recommendation (
           role_family_id, priority, confidence, confidence_label,
           issue_type, recommended_action, headline,
           key_signals_json, reasoning_summary,
           supporting_evidence_json, draft_rubric_json,
           draft_guidance_json, raw_model_output_json, status
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'active')
         RETURNING *
       )
       SELECT i.*, rf.name AS role_family_name
       FROM inserted i
       JOIN role_family rf ON rf.id = i.role_family_id`,
      [
        roleFamily.id,
        parsed.priority,
        cap.confidence,
        cap.label,
        parsed.issue_type,
        parsed.recommended_action,
        parsed.headline,
        JSON.stringify(parsed.key_signals),
        parsed.reasoning_summary,
        JSON.stringify(parsed.supporting_evidence),
        JSON.stringify(parsed.draft_rubric),
        JSON.stringify(parsed.draft_guidance),
        JSON.stringify(raw),
      ]
    )

    await client.query("COMMIT")
    return toRecommendationRow(rows[0])
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}
