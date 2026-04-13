import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import test from "node:test"

import {
  authenticateMcpBearerToken,
  toMcpAuthInfo,
} from "./auth.ts"

test("authenticateMcpBearerToken hashes bearer tokens before lookup", async () => {
  let receivedHash: string | undefined

  const auth = await authenticateMcpBearerToken(
    "Bearer secret-token",
    async (tokenHash) => {
      receivedHash = tokenHash

      return {
        id: "token-1",
        name: "Codex desktop",
        scopes: ["recommendations:read"],
        revoked_at: null,
      }
    }
  )

  const expectedHash = createHash("sha256")
    .update("secret-token")
    .digest("hex")

  assert.equal(receivedHash, expectedHash)
  assert.deepEqual(auth, {
    token: "secret-token",
    tokenId: "token-1",
    tokenName: "Codex desktop",
    scopes: ["recommendations:read"],
  })
})

test("authenticateMcpBearerToken rejects missing, malformed, and revoked tokens", async () => {
  let lookups = 0

  const missing = await authenticateMcpBearerToken(null, async () => {
    lookups += 1
    return null
  })

  const malformed = await authenticateMcpBearerToken("Basic nope", async () => {
    lookups += 1
    return null
  })

  const revoked = await authenticateMcpBearerToken(
    "Bearer revoked-token",
    async () => {
      lookups += 1
      return {
        id: "token-2",
        name: "Revoked token",
        scopes: [],
        revoked_at: "2026-04-12T00:00:00.000Z",
      }
    }
  )

  assert.equal(missing, null)
  assert.equal(malformed, null)
  assert.equal(revoked, null)
  assert.equal(lookups, 1)
})

test("toMcpAuthInfo preserves MCP caller metadata in authInfo.extra", () => {
  const authInfo = toMcpAuthInfo({
    token: "secret-token",
    tokenId: "token-3",
    tokenName: "Claude desktop",
    scopes: ["recommendations:read", "role-families:read"],
  })

  assert.equal(authInfo.token, "secret-token")
  assert.equal(authInfo.clientId, "token-3")
  assert.deepEqual(authInfo.scopes, [
    "recommendations:read",
    "role-families:read",
  ])
  assert.deepEqual(authInfo.extra, {
    tokenId: "token-3",
    tokenName: "Claude desktop",
  })
})
