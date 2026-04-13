"use client"

import { useState } from "react"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
  const [selectedRec, setSelectedRec] = useState<RecommendationRow | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calibration Recommendations</CardTitle>
              <CardDescription>
                {recommendations.length} recommendation{recommendations.length !== 1 && "s"}
              </CardDescription>
            </div>
            <RegenerateAllButton />
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <colgroup>
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col />
              <col className="w-[150px]" />
              <col className="w-[140px]" />
              <col className="w-[120px]" />
            </colgroup>
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
              {recommendations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No recommendations found.
                  </TableCell>
                </TableRow>
              ) : (
                recommendations.map((rec) => (
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
                    <TableCell className="font-medium whitespace-normal break-words">
                      {rec.headline ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-normal break-words">
                      {rec.role_family_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate">
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
          className="data-[side=right]:sm:max-w-6xl flex flex-col overflow-hidden"
        >
          {selectedRec && (
            <>
              <SheetHeader className="border-b border-border pb-4 shrink-0">
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
