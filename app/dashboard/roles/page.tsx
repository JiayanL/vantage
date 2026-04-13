import { connection } from "next/server"
import { RoleFamiliesTable } from "@/components/dashboard/roles/role-families-table"
import {
  listRecommendations,
  listRoleFamilies,
} from "@/lib/services/recommendations"
import type { RecommendationRow } from "@/lib/types/recommendation"

export default async function RoleFamiliesPage() {
  await connection()
  const [roleFamilies, recommendations] = await Promise.all([
    listRoleFamilies(),
    listRecommendations({ status: "active" }),
  ])

  const recommendationsByFamilyId: Record<string, RecommendationRow> = {}
  for (const rec of recommendations) {
    if (!recommendationsByFamilyId[rec.role_family_id]) {
      recommendationsByFamilyId[rec.role_family_id] = rec
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Role Families
        </h1>
        <p className="text-sm text-muted-foreground">
          All role families and their current calibration recommendation status.
        </p>
      </div>
      <RoleFamiliesTable
        roleFamilies={roleFamilies}
        recommendationsByFamilyId={recommendationsByFamilyId}
      />
    </div>
  )
}
