-- 0003_mcp_tokens.sql
-- MCP bearer-token auth tables and tool-call audit logging.

CREATE TABLE mcp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}'::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE mcp_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcp_token_id UUID NOT NULL REFERENCES mcp_tokens(id),
  token_name TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  arguments_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  called_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mcp_call_log_called_at
  ON mcp_call_log (called_at DESC);
