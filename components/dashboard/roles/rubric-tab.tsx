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
import { BookOpen } from "lucide-react"
import type { DraftRubric } from "@/lib/types/recommendation"

type RubricTabProps = {
  rubric: DraftRubric | null
}

export function RubricTab({ rubric }: RubricTabProps) {
  if (!rubric) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="size-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No rubric has been generated for this role family yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="size-4" />
          Draft Rubric
        </CardTitle>
        <CardDescription>{rubric.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        {rubric.changes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rubric changes proposed.
          </p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dimension</TableHead>
                  <TableHead>Current State</TableHead>
                  <TableHead>Recommended Change</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rubric.changes.map((change, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">
                      {change.dimension}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {change.current_state}
                    </TableCell>
                    <TableCell className="text-sm">
                      {change.recommended_change}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {change.rationale}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
