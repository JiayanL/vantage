import { StatCard } from "@/components/dashboard/stat-card"
import type { DashboardStats } from "@/lib/types/dashboard"
import { FileText, Briefcase, ShieldCheck, AlertTriangle } from "lucide-react"

type StatCardsProps = {
  stats: DashboardStats
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Artifacts"
        value={String(stats.totalArtifacts)}
        change=""
        changeType="neutral"
        description="across all role families"
        icon={FileText}
      />
      <StatCard
        title="Active Role Families"
        value={String(stats.activeRoleFamilies)}
        change=""
        changeType="neutral"
        description="currently tracked"
        icon={Briefcase}
      />
      <StatCard
        title="Active Recommendations"
        value={String(stats.activeRecommendations)}
        change=""
        changeType="neutral"
        description="pending review"
        icon={ShieldCheck}
      />
      <StatCard
        title="High Priority"
        value={String(stats.highPriorityCount)}
        change=""
        changeType="neutral"
        description="require attention"
        icon={AlertTriangle}
      />
    </div>
  )
}
