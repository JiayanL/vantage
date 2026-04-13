import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const navigationItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Recommendations", href: "/dashboard/hiring", icon: ShieldCheck },
  { title: "Role Families", href: "/dashboard/roles", icon: Briefcase },
  { title: "Transcripts", href: "/dashboard/artifacts", icon: FileText },
]
