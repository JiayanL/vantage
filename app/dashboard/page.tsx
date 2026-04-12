import { StatCards } from "@/components/dashboard/stat-cards"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"
import { RecentActivityTable } from "@/components/dashboard/recent-activity-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your hiring and retention pipeline.
        </p>
      </div>
      <StatCards />
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ChartPlaceholder />
        </div>
        <div className="lg:col-span-3">
          <RecentActivityTable />
        </div>
      </div>
    </div>
  )
}
