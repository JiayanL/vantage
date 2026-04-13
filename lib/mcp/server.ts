import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import * as z from "zod/v4"

import { createRecommendationToolHandlers } from "./tools"
import type { RecommendationToolDependencies } from "./tools"

export function createMcpServer(deps: RecommendationToolDependencies) {
  const server = new McpServer(
    {
      name: "vantage-hiring-recommendations",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  )

  const handlers = createRecommendationToolHandlers(deps)

  server.registerTool(
    "list_hiring_recommendations",
    {
      description:
        "List hiring recommendations, optionally filtered by role family, status, priority, or limit.",
      inputSchema: {
        role_family_id: z.string().uuid().optional(),
        status: z.enum(["active", "superseded"]).optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        limit: z.number().int().positive().max(100).optional(),
      },
      annotations: {
        readOnlyHint: true,
      },
    },
    handlers.list_hiring_recommendations
  )

  server.registerTool(
    "get_recommendation",
    {
      description: "Fetch a single hiring recommendation by ID.",
      inputSchema: {
        id: z.string().uuid(),
      },
      annotations: {
        readOnlyHint: true,
      },
    },
    handlers.get_recommendation
  )

  server.registerTool(
    "list_role_families",
    {
      description: "List role families currently tracked in the hiring dashboard.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
      },
    },
    handlers.list_role_families
  )

  return server
}
