import {
  Users,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"

export type DashboardStat = {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  description: string
  icon: LucideIcon
}

export const dashboardStats: DashboardStat[] = [
  {
    title: "Total Candidates",
    value: "142",
    change: "+12%",
    changeType: "positive",
    description: "from last month",
    icon: Users,
  },
  {
    title: "Open Roles",
    value: "8",
    change: "+2",
    changeType: "positive",
    description: "new this week",
    icon: Briefcase,
  },
  {
    title: "Active Recommendations",
    value: "24",
    change: "-3",
    changeType: "negative",
    description: "pending review",
    icon: ShieldCheck,
  },
  {
    title: "Retention Alerts",
    value: "3",
    change: "+1",
    changeType: "negative",
    description: "require attention",
    icon: AlertTriangle,
  },
]

export type ActivityItem = {
  id: string
  person: string
  role: string
  action: string
  date: string
  status: "completed" | "pending" | "in_review"
  priority: "low" | "medium" | "high" | "critical"
}

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    person: "Sarah Chen",
    role: "Senior Engineer",
    action: "Recommendation generated",
    date: "2026-04-12",
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    person: "Marcus Johnson",
    role: "Product Manager",
    action: "Interview scorecard uploaded",
    date: "2026-04-11",
    status: "completed",
    priority: "medium",
  },
  {
    id: "3",
    person: "Aisha Patel",
    role: "Data Scientist",
    action: "Retention review flagged",
    date: "2026-04-11",
    status: "in_review",
    priority: "critical",
  },
  {
    id: "4",
    person: "James Wilson",
    role: "Design Lead",
    action: "Offer extended",
    date: "2026-04-10",
    status: "completed",
    priority: "medium",
  },
  {
    id: "5",
    person: "Elena Rodriguez",
    role: "Frontend Engineer",
    action: "Recommendation generated",
    date: "2026-04-10",
    status: "pending",
    priority: "high",
  },
  {
    id: "6",
    person: "David Kim",
    role: "Engineering Manager",
    action: "Transcript processed",
    date: "2026-04-09",
    status: "completed",
    priority: "low",
  },
  {
    id: "7",
    person: "Priya Sharma",
    role: "Staff Engineer",
    action: "Retention alert resolved",
    date: "2026-04-09",
    status: "completed",
    priority: "medium",
  },
  {
    id: "8",
    person: "Tom Bradley",
    role: "Backend Engineer",
    action: "Interview scheduled",
    date: "2026-04-08",
    status: "pending",
    priority: "low",
  },
]
