import { regenerateAll } from "@/lib/services/recommendations"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const results = await regenerateAll()
    return Response.json({
      success: true,
      regenerated: results.length,
      ids: results.map((r) => r.id),
    })
  } catch (err) {
    console.error("Cron regeneration failed:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Regeneration failed" },
      { status: 500 }
    )
  }
}
