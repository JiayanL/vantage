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
import type { Priority, RecommendationRow } from "@/lib/types/recommendation"
import { cn } from "@/lib/utils"

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

type RecentActivityTableProps = {
  recommendations: RecommendationRow[]
}

export function RecentActivityTable({
  recommendations,
}: RecentActivityTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest hiring recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Family</TableHead>
              <TableHead>Headline</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recommendations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  No recommendations yet. Generate some from the Hiring page.
                </TableCell>
              </TableRow>
            ) : (
              recommendations.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>
                    <div className="font-medium">{rec.role_family_name}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {rec.headline ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant[rec.priority]}>
                      {rec.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        rec.status === "active" &&
                          "text-emerald-600 dark:text-emerald-400",
                        rec.status === "superseded" && "text-muted-foreground"
                      )}
                    >
                      {rec.status === "active" ? "Active" : "Superseded"}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(rec.generated_at)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
