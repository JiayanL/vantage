import assert from "node:assert/strict"
import test from "node:test"

import type { RecommendationRow, RoleFamilyRow } from "../types/recommendation.ts"
import { createRecommendationToolHandlers } from "./tools.ts"

const sampleRecommendation: RecommendationRow = {
  id: "recommendation-1",
  role_family_id: "family-1",
  role_family_name: "Engineering",
  priority: "critical",
  confidence: 0.92,
  confidence_label: "High confidence",
  issue_type: "pipeline",
  recommended_action: "Tighten panel calibration",
  headline: "Interview signal quality is inconsistent",
  key_signals: ["late feedback", "rubric drift"],
  reasoning_summary: "Panelists are using different standards.",
  supporting_evidence: [],
  draft_rubric: null,
  draft_guidance: null,
  raw_model_output: null,
  generated_at: "2026-04-12T00:00:00.000Z",
  status: "active",
}

const sampleRoleFamilies: RoleFamilyRow[] = [
  {
    id: "family-1",
    name: "Engineering",
    description: "Software engineering roles",
    status: "active",
    metadata_json: null,
    created_at: "2026-04-12T00:00:00.000Z",
  },
]

test("list_hiring_recommendations logs caller identity and forwards filters", async () => {
  let receivedFilters: Record<string, unknown> | undefined
  const loggedCalls: unknown[] = []

  const handlers = createRecommendationToolHandlers({
    listRecommendations: async (filters) => {
      receivedFilters = filters as Record<string, unknown>
      return [sampleRecommendation]
    },
    getRecommendationDetail: async () => sampleRecommendation,
    listRoleFamilies: async () => sampleRoleFamilies,
    logToolCall: async (entry) => {
      loggedCalls.push(entry)
    },
  })

  const result = await handlers.list_hiring_recommendations(
    {
      priority: "critical",
      limit: 5,
    },
    {
      authInfo: {
        extra: {
          tokenId: "token-1",
          tokenName: "Codex desktop",
        },
      },
    } as never
  )

  assert.deepEqual(receivedFilters, {
    priority: "critical",
    limit: 5,
  })
  assert.deepEqual(loggedCalls, [
    {
      mcpTokenId: "token-1",
      tokenName: "Codex desktop",
      toolName: "list_hiring_recommendations",
      argumentsJson: {
        priority: "critical",
        limit: 5,
      },
    },
  ])
  assert.equal(result.isError, undefined)
  assert.deepEqual(result.structuredContent, {
    recommendations: [sampleRecommendation],
  })
})

test("get_recommendation returns a tool error when the record is missing", async () => {
  const handlers = createRecommendationToolHandlers({
    listRecommendations: async () => [sampleRecommendation],
    getRecommendationDetail: async () => null,
    listRoleFamilies: async () => sampleRoleFamilies,
    logToolCall: async () => undefined,
  })

  const result = await handlers.get_recommendation(
    {
      id: "missing-id",
    },
    {
      authInfo: {
        extra: {
          tokenId: "token-2",
          tokenName: "Codex desktop",
        },
      },
    } as never
  )

  assert.equal(result.isError, true)
  assert.match(result.content[0]?.text ?? "", /not found/i)
})

test("list_role_families returns data and logs an empty argument object", async () => {
  const loggedCalls: unknown[] = []

  const handlers = createRecommendationToolHandlers({
    listRecommendations: async () => [sampleRecommendation],
    getRecommendationDetail: async () => sampleRecommendation,
    listRoleFamilies: async () => sampleRoleFamilies,
    logToolCall: async (entry) => {
      loggedCalls.push(entry)
    },
  })

  const result = await handlers.list_role_families(
    {},
    {
      authInfo: {
        extra: {
          tokenId: "token-3",
          tokenName: "Claude desktop",
        },
      },
    } as never
  )

  assert.deepEqual(loggedCalls, [
    {
      mcpTokenId: "token-3",
      tokenName: "Claude desktop",
      toolName: "list_role_families",
      argumentsJson: {},
    },
  ])
  assert.deepEqual(result.structuredContent, {
    roleFamilies: sampleRoleFamilies,
  })
})
