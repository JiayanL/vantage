import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatCardProps = {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  description: string
  icon: LucideIcon
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {changeType === "positive" ? (
            <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
          ) : changeType === "negative" ? (
            <TrendingDown className="size-3 text-red-600 dark:text-red-400" />
          ) : null}
          <span
            className={cn(
              changeType === "positive" &&
                "text-emerald-600 dark:text-emerald-400",
              changeType === "negative" && "text-red-600 dark:text-red-400",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
