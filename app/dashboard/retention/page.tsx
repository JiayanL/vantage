import { Construction } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function RetentionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Retention</h1>
        <p className="text-sm text-muted-foreground">
          Retention insights and recommendations.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Construction className="size-8 mb-2" />
          <p className="text-sm font-medium">Coming soon</p>
          <p className="text-xs">
            Retention recommendations will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
