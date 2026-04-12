import type { ResponseFormatJSONSchema } from "openai/resources/shared";

// --- TypeScript type (the contract everything else depends on) ---

export type RecommendationPayload = {
  priority: "low" | "medium" | "high" | "critical";
  confidence: number;
  issue_type: string;
  recommended_action: string;
  headline: string;
  key_signals: string[];
  reasoning_summary: string;
  supporting_evidence: Array<{
    artifact_id: string;
    quote: string;
    locator_hint: string;
  }>;
  draft_rubric: {
    summary: string;
    changes: Array<{
      dimension: string;
      current_state: string;
      recommended_change: string;
      rationale: string;
    }>;
  };
  draft_guidance: {
    summary: string;
    suggestions: Array<{
      area: string;
      current_state: string;
      recommended_change: string;
      rationale: string;
    }>;
  };
};

// --- JSON schema for OpenAI structured outputs (strict mode) ---

export const recommendationJsonSchema = {
  type: "json_schema" as const,
  json_schema: {
    name: "hiring_recommendation",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: [
        "priority",
        "confidence",
        "issue_type",
        "recommended_action",
        "headline",
        "key_signals",
        "reasoning_summary",
        "supporting_evidence",
        "draft_rubric",
        "draft_guidance",
      ],
      properties: {
        priority: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
        },
        confidence: {
          type: "number",
        },
        issue_type: {
          type: "string",
        },
        recommended_action: {
          type: "string",
        },
        headline: {
          type: "string",
        },
        key_signals: {
          type: "array",
          items: { type: "string" },
        },
        reasoning_summary: {
          type: "string",
        },
        supporting_evidence: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["artifact_id", "quote", "locator_hint"],
            properties: {
              artifact_id: { type: "string" },
              quote: { type: "string" },
              locator_hint: { type: "string" },
            },
          },
        },
        draft_rubric: {
          type: "object",
          additionalProperties: false,
          required: ["summary", "changes"],
          properties: {
            summary: { type: "string" },
            changes: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "dimension",
                  "current_state",
                  "recommended_change",
                  "rationale",
                ],
                properties: {
                  dimension: { type: "string" },
                  current_state: { type: "string" },
                  recommended_change: { type: "string" },
                  rationale: { type: "string" },
                },
              },
            },
          },
        },
        draft_guidance: {
          type: "object",
          additionalProperties: false,
          required: ["summary", "suggestions"],
          properties: {
            summary: { type: "string" },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "area",
                  "current_state",
                  "recommended_change",
                  "rationale",
                ],
                properties: {
                  area: { type: "string" },
                  current_state: { type: "string" },
                  recommended_change: { type: "string" },
                  rationale: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies ResponseFormatJSONSchema;
