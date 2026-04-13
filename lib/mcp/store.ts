import pool from "../db"

import type { McpTokenRecord } from "./auth"
import type { McpToolCallLog } from "./tools"

export async function findMcpTokenByHash(
  tokenHash: string
): Promise<McpTokenRecord | null> {
  const { rows } = await pool.query(
    `SELECT id, name, scopes, revoked_at
     FROM mcp_tokens
     WHERE token_hash = $1`,
    [tokenHash]
  )

  if (rows.length === 0) {
    return null
  }

  const row = rows[0] as {
    id: string
    name: string
    scopes: string[] | null
    revoked_at: Date | null
  }

  return {
    id: row.id,
    name: row.name,
    scopes: row.scopes ?? [],
    revoked_at: row.revoked_at,
  }
}

export async function logMcpToolCall(entry: McpToolCallLog): Promise<void> {
  await pool.query(
    `INSERT INTO mcp_call_log (
       mcp_token_id,
       token_name,
       tool_name,
       arguments_json
     )
     VALUES ($1, $2, $3, $4::jsonb)`,
    [
      entry.mcpTokenId,
      entry.tokenName,
      entry.toolName,
      JSON.stringify(entry.argumentsJson),
    ]
  )
}
