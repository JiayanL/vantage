import { notFound } from "next/navigation"
import { connection } from "next/server"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { priorityVariant } from "@/lib/constants/priority"
import {
  getRoleFamilyById,
  listRecommendations,
} from "@/lib/services/recommendations"
import { RoleFamilyTabs } from "@/components/dashboard/roles/role-family-tabs"
import { Briefcase } from "lucide-react"

export default async function RoleFamilyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connection()

  const [roleFamily, recommendations] = await Promise.all([
    getRoleFamilyById(id),
    listRecommendations({ role_family_id: id, status: "active", limit: 1 }),
  ])

  if (!roleFamily) {
    notFound()
  }

  const recommendation = recommendations[0] ?? null

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/dashboard/roles" />}>
        <ArrowLeft className="size-4" />
        Back to Role Families
      </Button>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {roleFamily.name}
          </h1>
          {recommendation && (
            <Badge variant={priorityVariant[recommendation.priority]}>
              {recommendation.priority}
            </Badge>
          )}
        </div>
        {roleFamily.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {roleFamily.description}
          </p>
        )}
      </div>

      {recommendation ? (
        <RoleFamilyTabs recommendation={recommendation} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Briefcase className="size-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No active recommendation has been generated for this role family.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recommendations are generated based on available artifacts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
