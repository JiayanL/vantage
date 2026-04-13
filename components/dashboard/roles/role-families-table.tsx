"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Code,
  PenTool,
  BarChart3,
  Users,
  Megaphone,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { priorityVariant } from "@/lib/constants/priority"
import type {
  RecommendationRow,
  RoleFamilyRow,
} from "@/lib/types/recommendation"

const ROLE_ICON_MAP: Record<string, LucideIcon> = {
  engineering: Code,
  design: PenTool,
  data: BarChart3,
  product: Briefcase,
  people: Users,
  marketing: Megaphone,
  operations: Settings,
}

function getRoleIcon(name: string): LucideIcon {
  const lower = name.toLowerCase()
  for (const [keyword, icon] of Object.entries(ROLE_ICON_MAP)) {
    if (lower.includes(keyword)) return icon
  }
  return Briefcase
}

type RoleFamiliesTableProps = {
  roleFamilies: RoleFamilyRow[]
  recommendationsByFamilyId: Record<string, RecommendationRow>
}

export function RoleFamiliesTable({
  roleFamilies,
  recommendationsByFamilyId,
}: RoleFamiliesTableProps) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="size-4" />
          Role Families
        </CardTitle>
        <CardDescription>
          {roleFamilies.length} role{" "}
          {roleFamilies.length === 1 ? "family" : "families"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Headline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roleFamilies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8"
                >
                  No role families found.
                </TableCell>
              </TableRow>
            ) : (
              roleFamilies.map((rf) => {
                const rec = recommendationsByFamilyId[rf.id]
                const Icon = getRoleIcon(rf.name)
                return (
                  <TableRow
                    key={rf.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/roles/${rf.id}`)}
                  >
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground shrink-0" />
                        {rf.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      {rec ? (
                        <Badge variant={priorityVariant[rec.priority]}>
                          {rec.priority}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {rec?.headline ?? "\u2014"}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
