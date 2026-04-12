-- 0001_init.sql
-- Hiring tables + retention stubs

-- Enums
CREATE TYPE artifact_type AS ENUM ('transcript', 'scorecard', 'rubric');
CREATE TYPE priority      AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE rec_status    AS ENUM ('active', 'superseded');

-- Migrations ledger
CREATE TABLE IF NOT EXISTS _migrations (
  filename TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------------------
-- Hiring
------------------------------------------------------------------------

CREATE TABLE role_family (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  description    TEXT,
  status         TEXT NOT NULL DEFAULT 'active',
  metadata_json  JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE artifact (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_family_id UUID NOT NULL REFERENCES role_family(id),
  artifact_type  artifact_type NOT NULL,
  title          TEXT NOT NULL,
  source_ref     TEXT,
  content        TEXT,
  captured_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_artifact_role_family ON artifact(role_family_id);

CREATE TABLE hiring_recommendation (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_family_id           UUID NOT NULL REFERENCES role_family(id),
  priority                 priority NOT NULL,
  confidence               NUMERIC(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  confidence_label         TEXT,
  issue_type               TEXT,
  recommended_action       TEXT,
  headline                 TEXT,
  key_signals_json         JSONB,
  reasoning_summary        TEXT,
  supporting_evidence_json JSONB,   -- [{artifact_id, quote, locator_hint}]
  draft_rubric_json        JSONB,
  draft_guidance_json      JSONB,
  raw_model_output_json    JSONB,
  generated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  status                   rec_status NOT NULL DEFAULT 'active'
);

CREATE INDEX idx_hiring_rec_role_family ON hiring_recommendation(role_family_id);
CREATE INDEX idx_hiring_rec_status      ON hiring_recommendation(status);

------------------------------------------------------------------------
-- Retention stubs
------------------------------------------------------------------------

CREATE TABLE person (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT,
  title      TEXT,
  department TEXT,
  metadata_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE retention_recommendation (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id                UUID NOT NULL REFERENCES person(id),
  priority                 priority NOT NULL,
  confidence               NUMERIC(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  confidence_label         TEXT,
  issue_type               TEXT,
  recommended_action       TEXT,
  headline                 TEXT,
  key_signals_json         JSONB,
  reasoning_summary        TEXT,
  supporting_evidence_json JSONB,
  draft_rubric_json        JSONB,
  draft_guidance_json      JSONB,
  raw_model_output_json    JSONB,
  generated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  status                   rec_status NOT NULL DEFAULT 'active'
);

CREATE INDEX idx_retention_rec_person ON retention_recommendation(person_id);
CREATE INDEX idx_retention_rec_status ON retention_recommendation(status);
