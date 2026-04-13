import { StatCards } from "@/components/dashboard/stat-cards"
import { TalentLifecycle } from "@/components/dashboard/talent-lifecycle"
import { RecentActivityTable } from "@/components/dashboard/recent-activity-table"
import { getDashboardStats } from "@/lib/db/queries"
import { listRecommendations } from "@/lib/services/recommendations"

export default async function DashboardPage() {
  const [stats, recentRecs] = await Promise.all([
    getDashboardStats(),
    listRecommendations({ status: "active", limit: 8 }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your hiring and retention pipeline.
        </p>
      </div>
      <StatCards stats={stats} />
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <TalentLifecycle />
        </div>
        <div className="lg:col-span-3">
          <RecentActivityTable recommendations={recentRecs} />
        </div>
      </div>
    </div>
  )
}
