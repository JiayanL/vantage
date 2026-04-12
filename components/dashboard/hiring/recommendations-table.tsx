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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  Priority,
  RecommendationRow,
  RoleFamilyRow,
} from "@/lib/types/recommendation"
import { RegenerateButton } from "@/components/dashboard/hiring/regenerate-button"
import { RegenerateAllButton } from "@/components/dashboard/hiring/regenerate-all-button"
import { RecommendationDetail } from "@/components/dashboard/hiring/recommendation-detail"

const priorityVariant: Record<
  Priority,
  "destructive" | "default" | "secondary" | "outline"
> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
}

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

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

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recommendations</CardTitle>
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
              <TableHead className="w-8" />
              <TableHead>Priority</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Headline</TableHead>
              <TableHead>Role Family</TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Generated</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-8"
                >
                  No recommendations match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((rec) => (
                <Collapsible
                  key={rec.id}
                  open={expandedIds.has(rec.id)}
                  onOpenChange={() => toggleExpanded(rec.id)}
                >
                  <CollapsibleTrigger
                    render={
                      <TableRow className="cursor-pointer hover:bg-muted/50" />
                    }
                  >
                    <TableCell>
                      <ChevronRight
                        className={cn(
                          "size-4 text-muted-foreground transition-transform",
                          expandedIds.has(rec.id) && "rotate-90"
                        )}
                      />
                    </TableCell>
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
                    <TableCell className="max-w-[250px] truncate font-medium">
                      {rec.headline ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {rec.role_family_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {rec.issue_type ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(rec.generated_at)}
                    </TableCell>
                    <TableCell>
                      <RegenerateButton roleFamilyId={rec.role_family_id} />
                    </TableCell>
                  </CollapsibleTrigger>

                  <CollapsibleContent
                    render={
                      <tr>
                        <td colSpan={8} className="p-0">
                          <div className="border-t border-border bg-muted/30 px-6 py-4">
                            <RecommendationDetail recommendation={rec} />
                          </div>
                        </td>
                      </tr>
                    }
                  />
                </Collapsible>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
