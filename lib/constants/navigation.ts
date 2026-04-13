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

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navigationGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Hiring",
    items: [
      { title: "Role Families", href: "/dashboard/roles", icon: Briefcase },
      { title: "Transcripts", href: "/dashboard/artifacts", icon: FileText },
      {
        title: "Recommendations",
        href: "/dashboard/hiring",
        icon: ShieldCheck,
      },
    ],
  },
]
