import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

export type NavItemMatch = "exact" | "prefix"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  match: NavItemMatch
}

export const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    match: "exact",
  },
  {
    title: "Recommendations",
    href: "/dashboard/hiring",
    icon: ShieldCheck,
    match: "prefix",
  },
  {
    title: "Role Families",
    href: "/dashboard/roles",
    icon: Briefcase,
    match: "prefix",
  },
  {
    title: "Transcripts",
    href: "/dashboard/artifacts",
    icon: FileText,
    match: "prefix",
  },
]

export function isNavigationItemActive(
  item: NavItem,
  pathname: string
): boolean {
  if (item.match === "exact") {
    return pathname === item.href
  }

  return pathname === item.href || pathname.startsWith(item.href + "/")
}
