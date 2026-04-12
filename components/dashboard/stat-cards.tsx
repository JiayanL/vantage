import { dashboardStats } from "@/lib/constants/mock-data"
import { StatCard } from "@/components/dashboard/stat-card"

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dashboardStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
