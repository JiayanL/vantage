import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Search,
  Scale,
  Handshake,
  UserPlus,
  Layers,
  Shield,
  Heart,
  type LucideIcon,
} from "lucide-react"

const stages = [
  { name: "Talent Sourcing", description: "General & specialized pipelines", icon: Search },
  { name: "Interview Quality", description: "Maintaining the evaluation bar", icon: Scale },
  { name: "Offer Competitiveness", description: "Winning with strong offers", icon: Handshake },
  { name: "Onboarding", description: "Ramping new hires effectively", icon: UserPlus },
  { name: "Scaling Operations", description: "Managing growth capacity", icon: Layers },
  { name: "Culture & Rigor", description: "Preserving standards at scale", icon: Shield },
  { name: "Talent Retention", description: "Keeping top talent engaged", icon: Heart },
] as const

function LifecycleNode({ icon: Icon, name, description }: { icon: LucideIcon; name: string; description: string }) {
  return (
    <div className="flex flex-1 items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2 ring-1 ring-border">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium leading-tight">{name}</p>
        <p className="text-[10px] leading-tight text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function TalentLifecycle() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Talent Lifecycle</CardTitle>
        <CardDescription>
          Interconnected domains of talent management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {stages.map((stage) => (
          <LifecycleNode key={stage.name} {...stage} />
        ))}
      </CardContent>
    </Card>
  )
}
