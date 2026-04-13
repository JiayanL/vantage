"use client"

import { useState, useMemo } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type {
  RecommendationRow,
  RoleFamilyRow,
} from "@/lib/types/recommendation"
import { priorityVariant } from "@/lib/constants/priority"
import { RegenerateAllButton } from "@/components/dashboard/hiring/regenerate-all-button"
import { RecommendationSheetContent } from "@/components/dashboard/hiring/recommendation-sheet-content"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

type RecommendationsTableProps = {
  recommendations: RecommendationRow[]
  roleFamilies: RoleFamilyRow[]
}

export function RecommendationsTable({
  recommendations,
  roleFamilies,
}: RecommendationsTableProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [confidenceFilter, setConfidenceFilter] = useState<string>("any")
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>("all")
  const [selectedRec, setSelectedRec] = useState<RecommendationRow | null>(null)

  const issueTypes = useMemo(() => {
    const types = new Set<string>()
    for (const r of recommendations) {
      if (r.issue_type) types.add(r.issue_type)
    }
    return Array.from(types).sort()
  }, [recommendations])

  const filtered = useMemo(() => {
    return recommendations.filter((r) => {
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false
      if (confidenceFilter !== "any" && r.confidence < Number(confidenceFilter))
        return false
      if (issueTypeFilter !== "all" && r.issue_type !== issueTypeFilter)
        return false
      return true
    })
  }, [recommendations, priorityFilter, confidenceFilter, issueTypeFilter])

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calibration Recommendations</CardTitle>
              <CardDescription>
                {filtered.length} of {recommendations.length} recommendations
              </CardDescription>
            </div>
            <RegenerateAllButton />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Select
              value={priorityFilter}
              onValueChange={(v) => setPriorityFilter(v ?? "all")}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={confidenceFilter}
              onValueChange={(v) => setConfidenceFilter(v ?? "any")}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any confidence</SelectItem>
                <SelectItem value="0.3">&gt; 30%</SelectItem>
                <SelectItem value="0.5">&gt; 50%</SelectItem>
                <SelectItem value="0.7">&gt; 70%</SelectItem>
                <SelectItem value="0.9">&gt; 90%</SelectItem>
              </SelectContent>
            </Select>

            {issueTypes.length > 0 && (
              <Select
                value={issueTypeFilter}
                onValueChange={(v) => setIssueTypeFilter(v ?? "all")}
              >
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All issue types</SelectItem>
                  {issueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Headline</TableHead>
                <TableHead>Role Family</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Generated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No recommendations match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((rec) => (
                  <TableRow
                    key={rec.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedRec(rec)}
                  >
                    <TableCell>
                      <Badge variant={priorityVariant[rec.priority]}>
                        {rec.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {Math.round(rec.confidence * 100)}%
                      </span>
                    </TableCell>
                    <TableCell className={cn("max-w-xs font-medium break-words")}>
                      {rec.headline ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {rec.role_family_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {rec.issue_type ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatDate(rec.generated_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={selectedRec !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRec(null)
        }}
      >
        <SheetContent
          side="right"
          className="data-[side=right]:sm:max-w-6xl overflow-y-auto"
        >
          {selectedRec && (
            <>
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle>{selectedRec.headline ?? "Recommendation"}</SheetTitle>
                <SheetDescription>
                  {selectedRec.role_family_name}
                  {selectedRec.issue_type && ` · ${selectedRec.issue_type}`}
                </SheetDescription>
              </SheetHeader>
              <RecommendationSheetContent recommendation={selectedRec} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
