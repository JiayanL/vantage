import { SummaryStrip } from "@/components/dashboard/hiring/summary-strip"
import { RecommendationsTable } from "@/components/dashboard/hiring/recommendations-table"
import {
  listRecommendations,
  listRoleFamilies,
} from "@/lib/services/recommendations"

export default async function HiringPage() {
  const [recommendations, roleFamilies] = await Promise.all([
    listRecommendations({ status: "active" }),
    listRoleFamilies(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Interview Calibration Recommendations
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-generated calibration recommendations based on interview artifact analysis.
        </p>
      </div>
      <SummaryStrip recommendations={recommendations} />
      <RecommendationsTable
        recommendations={recommendations}
        roleFamilies={roleFamilies}
      />
    </div>
  )
}
