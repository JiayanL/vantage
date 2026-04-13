export type ArtifactType = "transcript" | "scorecard" | "rubric"

export type ArtifactRow = {
  id: string
  role_family_id: string
  role_family_name: string
  artifact_type: ArtifactType
  title: string
  source_ref: string | null
  content: string | null
  captured_at: string | null
  created_at: string
}

export type TranscriptWithRubric = {
  id: string
  role_family_id: string
  role_family_name: string
  title: string
  content: string | null
  captured_at: string | null
  created_at: string
  matched_rubric_title: string | null
  matched_rubric_content: string | null
}
