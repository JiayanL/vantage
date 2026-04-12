import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export function ChartPlaceholder() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hiring Pipeline</CardTitle>
        <CardDescription>
          Candidate flow across stages this quarter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <BarChart3 className="size-8" />
            <p className="text-sm font-medium">Chart coming soon</p>
            <p className="text-xs">Pipeline visualization will appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
