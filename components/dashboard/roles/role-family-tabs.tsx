"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RubricTab } from "@/components/dashboard/roles/rubric-tab"
import { HiringRecommendationTab } from "@/components/dashboard/roles/hiring-recommendation-tab"
import type { RecommendationRow } from "@/lib/types/recommendation"
import type { ArtifactRow } from "@/lib/types/artifact"

type RoleFamilyTabsProps = {
  recommendation: RecommendationRow
  rubricArtifact: ArtifactRow | null
}

export function RoleFamilyTabs({ recommendation, rubricArtifact }: RoleFamilyTabsProps) {
  return (
    <Tabs defaultValue="rubric">
      <TabsList>
        <TabsTrigger value="rubric">Rubric</TabsTrigger>
        <TabsTrigger value="recommendation">Interview Calibration Recommendation</TabsTrigger>
      </TabsList>
      <TabsContent value="rubric" className="mt-4">
        <RubricTab rubricArtifact={rubricArtifact} />
      </TabsContent>
      <TabsContent value="recommendation" className="mt-4">
        <HiringRecommendationTab recommendation={recommendation} />
      </TabsContent>
    </Tabs>
  )
}
