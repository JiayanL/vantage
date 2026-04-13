import type { Priority } from "@/lib/types/recommendation"

export const priorityVariant: Record<
  Priority,
  "destructive" | "default" | "secondary" | "outline"
> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
}
