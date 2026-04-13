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
  ChevronRight,
  ChevronDown,
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

function HorizontalConnector({ direction }: { direction: "ltr" | "rtl" }) {
  return (
    <div className="flex shrink-0 items-center px-1">
      {direction === "ltr" ? (
        <>
          <div className="h-px w-4 bg-muted-foreground/25 sm:w-6" />
          <ChevronRight className="size-3 -ml-1 text-muted-foreground/40" />
        </>
      ) : (
        <>
          <ChevronDown className="size-3 -mr-1 rotate-90 text-muted-foreground/40" />
          <div className="h-px w-4 bg-muted-foreground/25 sm:w-6" />
        </>
      )}
    </div>
  )
}

function VerticalConnector({ align }: { align: "left" | "right" }) {
  return (
    <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col items-center ${align === "right" ? "mr-[calc(50%-8px)]" : "ml-[calc(50%-8px)]"}`}>
        <div className="h-3 w-px bg-muted-foreground/25" />
        <ChevronDown className="size-3 -mt-1 text-muted-foreground/40" />
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
      <CardContent className="space-y-1">
        {/* Row 1: Talent Sourcing → Interview Quality */}
        <div className="flex items-center">
          <LifecycleNode {...stages[0]} />
          <HorizontalConnector direction="ltr" />
          <LifecycleNode {...stages[1]} />
        </div>

        {/* Vertical connector: right side */}
        <VerticalConnector align="right" />

        {/* Row 2: Onboarding ← Offer Competitiveness */}
        <div className="flex items-center">
          <LifecycleNode {...stages[3]} />
          <HorizontalConnector direction="rtl" />
          <LifecycleNode {...stages[2]} />
        </div>

        {/* Vertical connector: left side */}
        <VerticalConnector align="left" />

        {/* Row 3: Scaling Operations → Culture & Rigor */}
        <div className="flex items-center">
          <LifecycleNode {...stages[4]} />
          <HorizontalConnector direction="ltr" />
          <LifecycleNode {...stages[5]} />
        </div>

        {/* Vertical connector: right side */}
        <VerticalConnector align="right" />

        {/* Row 4: Talent Retention (right-aligned) */}
        <div className="flex items-center">
          <div className="flex-1" />
          <div className="shrink-0 px-1 sm:px-1">
            <div className="w-4 sm:w-6" />
          </div>
          <LifecycleNode {...stages[6]} />
        </div>
      </CardContent>
    </Card>
  )
}
