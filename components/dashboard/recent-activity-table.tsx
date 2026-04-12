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
import { recentActivity, type ActivityItem } from "@/lib/constants/mock-data"
import { cn } from "@/lib/utils"

const priorityVariant: Record<
  ActivityItem["priority"],
  "destructive" | "default" | "secondary" | "outline"
> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
}

const statusLabel: Record<ActivityItem["status"], string> = {
  completed: "Completed",
  pending: "Pending",
  in_review: "In Review",
}

export function RecentActivityTable() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest hiring and retention events</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.person}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.role}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.action}
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[item.priority]}>
                    {item.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      item.status === "completed" && "text-emerald-600 dark:text-emerald-400",
                      item.status === "pending" && "text-muted-foreground",
                      item.status === "in_review" && "text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {statusLabel[item.status]}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
