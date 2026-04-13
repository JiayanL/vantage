"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RecommendationDetail } from "@/components/dashboard/hiring/recommendation-detail"
import type { RecommendationRow } from "@/lib/types/recommendation"

type HiringRecommendationTabProps = {
  recommendation: RecommendationRow
}

export function HiringRecommendationTab({
  recommendation: rec,
}: HiringRecommendationTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{rec.headline ?? "Interview Calibration Recommendation"}</CardTitle>
        {rec.issue_type && (
          <CardDescription>Issue type: {rec.issue_type}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <RecommendationDetail recommendation={rec} />
      </CardContent>
    </Card>
  )
}
