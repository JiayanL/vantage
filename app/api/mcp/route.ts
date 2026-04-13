import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"

import {
  authenticateMcpBearerToken,
  toMcpAuthInfo,
} from "@/lib/mcp/auth"
import { createMcpServer } from "@/lib/mcp/server"
import { findMcpTokenByHash, logMcpToolCall } from "@/lib/mcp/store"
import {
  getRecommendationDetail,
  listRecommendations,
  listRoleFamilies,
} from "@/lib/services/recommendations"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function handleMcpRequest(request: Request): Promise<Response> {
  const authContext = await authenticateMcpBearerToken(
    request.headers.get("authorization"),
    findMcpTokenByHash
  )

  if (!authContext) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const server = createMcpServer({
    listRecommendations,
    getRecommendationDetail,
    listRoleFamilies,
    logToolCall: logMcpToolCall,
  })

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  try {
    await server.connect(transport)

    return await transport.handleRequest(request, {
      authInfo: toMcpAuthInfo(authContext),
    })
  } catch (error) {
    console.error("MCP request failed:", error)

    return Response.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleMcpRequest(request)
}

export async function GET(request: Request): Promise<Response> {
  return handleMcpRequest(request)
}

export async function DELETE(request: Request): Promise<Response> {
  return handleMcpRequest(request)
}
