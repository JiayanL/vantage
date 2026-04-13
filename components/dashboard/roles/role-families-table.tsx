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
import { Briefcase } from "lucide-react"
import { priorityVariant } from "@/lib/constants/priority"
import type {
  RecommendationRow,
  RoleFamilyRow,
} from "@/lib/types/recommendation"

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
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Headline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roleFamilies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  No role families found.
                </TableCell>
              </TableRow>
            ) : (
              roleFamilies.map((rf) => {
                const rec = recommendationsByFamilyId[rf.id]
                return (
                  <TableRow
                    key={rf.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/roles/${rf.id}`)}
                  >
                    <TableCell className="font-medium">{rf.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rf.status}</Badge>
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
