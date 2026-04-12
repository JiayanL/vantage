export type Priority = "low" | "medium" | "high" | "critical"
export type RecStatus = "active" | "superseded"

export type SupportingEvidence = {
  artifact_id: string
  quote: string
  locator_hint: string
}

export type DraftRubric = {
  summary: string
  changes: Array<{
    dimension: string
    current_state: string
    recommended_change: string
    rationale: string
  }>
}

export type DraftGuidance = {
  summary: string
  suggestions: Array<{
    area: string
    current_state: string
    recommended_change: string
    rationale: string
  }>
}

export type RecommendationRow = {
  id: string
  role_family_id: string
  role_family_name: string
  priority: Priority
  confidence: number
  confidence_label: string | null
  issue_type: string | null
  recommended_action: string | null
  headline: string | null
  key_signals: string[]
  reasoning_summary: string | null
  supporting_evidence: SupportingEvidence[]
  draft_rubric: DraftRubric | null
  draft_guidance: DraftGuidance | null
  raw_model_output: unknown | null
  generated_at: string
  status: RecStatus
}

export type RoleFamilyRow = {
  id: string
  name: string
  description: string | null
  status: string
  metadata_json: unknown | null
  created_at: string
}

export function toRecommendationRow(row: Record<string, unknown>): RecommendationRow {
  return {
    id: row.id as string,
    role_family_id: row.role_family_id as string,
    role_family_name: row.role_family_name as string,
    priority: row.priority as Priority,
    confidence: Number(row.confidence),
    confidence_label: (row.confidence_label as string) ?? null,
    issue_type: (row.issue_type as string) ?? null,
    recommended_action: (row.recommended_action as string) ?? null,
    headline: (row.headline as string) ?? null,
    key_signals: (row.key_signals_json as string[]) ?? [],
    reasoning_summary: (row.reasoning_summary as string) ?? null,
    supporting_evidence: (row.supporting_evidence_json as SupportingEvidence[]) ?? [],
    draft_rubric: (row.draft_rubric_json as DraftRubric) ?? null,
    draft_guidance: (row.draft_guidance_json as DraftGuidance) ?? null,
    raw_model_output: row.raw_model_output_json ?? null,
    generated_at: (row.generated_at as Date).toISOString(),
    status: row.status as RecStatus,
  }
}
