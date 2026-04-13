import type {
  Priority,
  RecommendationRow,
  RecStatus,
  RoleFamilyRow,
} from "../types/recommendation"

export type ListHiringRecommendationsArgs = {
  role_family_id?: string
  status?: RecStatus
  priority?: Priority
  limit?: number
}

export type GetRecommendationArgs = {
  id: string
}

export type McpToolCallLog = {
  mcpTokenId: string
  tokenName: string
  toolName: string
  argumentsJson: Record<string, unknown>
}

export type RecommendationToolDependencies = {
  listRecommendations: (
    filters: ListHiringRecommendationsArgs
  ) => Promise<RecommendationRow[]>
  getRecommendationDetail: (id: string) => Promise<RecommendationRow | null>
  listRoleFamilies: () => Promise<RoleFamilyRow[]>
  logToolCall: (entry: McpToolCallLog) => Promise<void>
}

type ToolAuthInfo = {
  authInfo?: {
    extra?: Record<string, unknown>
  }
}

type TextContent = {
  type: "text"
  text: string
}

type ToolResult = {
  content: TextContent[]
  structuredContent?: Record<string, unknown>
  isError?: boolean
}

function getToolCaller(extra: ToolAuthInfo): {
  tokenId: string
  tokenName: string
} {
  const tokenId = extra.authInfo?.extra?.tokenId
  const tokenName = extra.authInfo?.extra?.tokenName

  if (typeof tokenId !== "string" || typeof tokenName !== "string") {
    throw new Error("Missing MCP auth context")
  }

  return { tokenId, tokenName }
}

function toTextContent(data: unknown): TextContent[] {
  return [
    {
      type: "text",
      text: JSON.stringify(data, null, 2),
    },
  ]
}

function toSuccessResult(
  key: string,
  value: unknown
): ToolResult {
  return {
    content: toTextContent(value),
    structuredContent: {
      [key]: value,
    },
  }
}

function toErrorResult(message: string): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
    isError: true,
  }
}

export function createRecommendationToolHandlers(
  deps: RecommendationToolDependencies
) {
  return {
    async list_hiring_recommendations(
      args: ListHiringRecommendationsArgs = {},
      extra: ToolAuthInfo
    ): Promise<ToolResult> {
      const caller = getToolCaller(extra)

      await deps.logToolCall({
        mcpTokenId: caller.tokenId,
        tokenName: caller.tokenName,
        toolName: "list_hiring_recommendations",
        argumentsJson: args,
      })

      const recommendations = await deps.listRecommendations(args)
      return toSuccessResult("recommendations", recommendations)
    },

    async get_recommendation(
      args: GetRecommendationArgs,
      extra: ToolAuthInfo
    ): Promise<ToolResult> {
      const caller = getToolCaller(extra)

      await deps.logToolCall({
        mcpTokenId: caller.tokenId,
        tokenName: caller.tokenName,
        toolName: "get_recommendation",
        argumentsJson: args,
      })

      const recommendation = await deps.getRecommendationDetail(args.id)
      if (!recommendation) {
        return toErrorResult(`Recommendation not found: ${args.id}`)
      }

      return toSuccessResult("recommendation", recommendation)
    },

    async list_role_families(
      _args: Record<string, never>,
      extra: ToolAuthInfo
    ): Promise<ToolResult> {
      const caller = getToolCaller(extra)
      const args = {}

      await deps.logToolCall({
        mcpTokenId: caller.tokenId,
        tokenName: caller.tokenName,
        toolName: "list_role_families",
        argumentsJson: args,
      })

      const roleFamilies = await deps.listRoleFamilies()
      return toSuccessResult("roleFamilies", roleFamilies)
    },
  }
}
