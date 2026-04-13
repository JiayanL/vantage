import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js"

// @ts-expect-error -- node:test runs this helper directly with type stripping.
import { hashSecret } from "../auth.ts"

export type McpTokenRecord = {
  id: string
  name: string
  scopes: string[]
  revoked_at: Date | string | null
}

export type McpAuthContext = {
  token: string
  tokenId: string
  tokenName: string
  scopes: string[]
}

type FindTokenByHash = (
  tokenHash: string
) => Promise<McpTokenRecord | null>

const BEARER_PREFIX = "Bearer "

export async function authenticateMcpBearerToken(
  authHeader: string | null,
  findTokenByHash: FindTokenByHash
): Promise<McpAuthContext | null> {
  if (!authHeader?.startsWith(BEARER_PREFIX)) {
    return null
  }

  const token = authHeader.slice(BEARER_PREFIX.length).trim()
  if (!token) {
    return null
  }

  const tokenHash = await hashSecret(token)
  const tokenRecord = await findTokenByHash(tokenHash)

  if (!tokenRecord || tokenRecord.revoked_at) {
    return null
  }

  return {
    token,
    tokenId: tokenRecord.id,
    tokenName: tokenRecord.name,
    scopes: tokenRecord.scopes,
  }
}

export function toMcpAuthInfo(context: McpAuthContext): AuthInfo {
  return {
    token: context.token,
    clientId: context.tokenId,
    scopes: context.scopes,
    extra: {
      tokenId: context.tokenId,
      tokenName: context.tokenName,
    },
  }
}
