import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, TrendingUp } from "lucide-react"
import type { RecommendationRow } from "@/lib/types/recommendation"

type SummaryStripProps = {
  recommendations: RecommendationRow[]
}

export function SummaryStrip({ recommendations }: SummaryStripProps) {
  const highPriorityCount = recommendations.filter(
    (r) => r.priority === "critical" || r.priority === "high"
  ).length

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentCount = recommendations.filter(
    (r) => new Date(r.generated_at).getTime() > sevenDaysAgo
  ).length

  const highestConfidence = recommendations.reduce<RecommendationRow | null>(
    (best, r) => (!best || r.confidence > best.confidence ? r : best),
    null
  )

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            High Priority
          </CardTitle>
          <AlertTriangle className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityCount}</div>
          <p className="text-xs text-muted-foreground">
            critical or high priority
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recently Generated
          </CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentCount}</div>
          <p className="text-xs text-muted-foreground">in the last 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Highest Confidence
          </CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {highestConfidence
              ? `${Math.round(highestConfidence.confidence * 100)}%`
              : "—"}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {highestConfidence?.headline ?? "No recommendations yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
