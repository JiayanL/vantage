"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RubricTab } from "@/components/dashboard/roles/rubric-tab"
import { HiringRecommendationTab } from "@/components/dashboard/roles/hiring-recommendation-tab"
import type { RecommendationRow } from "@/lib/types/recommendation"

type RoleFamilyTabsProps = {
  recommendation: RecommendationRow
}

export function RoleFamilyTabs({ recommendation }: RoleFamilyTabsProps) {
  return (
    <Tabs defaultValue="rubric">
      <TabsList>
        <TabsTrigger value="rubric">Rubric</TabsTrigger>
        <TabsTrigger value="recommendation">Hiring Recommendation</TabsTrigger>
      </TabsList>
      <TabsContent value="rubric" className="mt-4">
        <RubricTab rubric={recommendation.draft_rubric} />
      </TabsContent>
      <TabsContent value="recommendation" className="mt-4">
        <HiringRecommendationTab recommendation={recommendation} />
      </TabsContent>
    </Tabs>
  )
}
