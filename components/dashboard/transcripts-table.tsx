"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { MarkdownContent } from "@/components/shared/markdown-content"
import type { TranscriptWithRubric } from "@/lib/types/artifact"

type SortField = "title" | "role_family_name" | "date"
type SortDirection = "asc" | "desc"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function SortableHeader({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
}: {
  label: string
  field: SortField
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}) {
  return (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => onSort(field)}
    >
      {label}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="size-3.5" />
        ) : (
          <ArrowDown className="size-3.5" />
        )
      ) : (
        <ArrowUpDown className="size-3.5 text-muted-foreground" />
      )}
    </button>
  )
}

type TranscriptsTableProps = {
  transcripts: TranscriptWithRubric[]
}

export function TranscriptsTable({ transcripts }: TranscriptsTableProps) {
  const [selected, setSelected] = useState<TranscriptWithRubric | null>(null)
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection(field === "date" ? "desc" : "asc")
    }
  }

  const sorted = useMemo(() => {
    return [...transcripts].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1

      if (sortField === "title") {
        return a.title.localeCompare(b.title) * dir
      }
      if (sortField === "role_family_name") {
        return a.role_family_name.localeCompare(b.role_family_name) * dir
      }
      // date
      const aDate = a.captured_at ?? a.created_at
      const bDate = b.captured_at ?? b.created_at
      return aDate.localeCompare(bDate) * dir
    })
  }, [transcripts, sortField, sortDirection])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Transcripts</CardTitle>
          <CardDescription>
            {transcripts.length} transcript{transcripts.length !== 1 && "s"}{" "}
            across all role families
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortableHeader
                    label="Title"
                    field="title"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Role Family"
                    field="role_family_name"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Date"
                    field="date"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No transcripts found.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((t) => (
                  <TableRow
                    key={t.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(t)}
                  >
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.role_family_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(t.captured_at ?? t.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <SheetContent
          side="right"
          className="data-[side=right]:sm:max-w-6xl overflow-y-auto"
        >
          {selected && (
            <>
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>{selected.role_family_name}</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Transcript
                  </h3>
                  <MarkdownContent content={selected.content} />
                </div>
                <div className="min-w-0 md:border-l md:border-border md:pl-6">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Human-Graded Rubric
                  </h3>
                  {selected.matched_rubric_content ? (
                    <MarkdownContent content={selected.matched_rubric_content} />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No matching rubric found for this transcript.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
