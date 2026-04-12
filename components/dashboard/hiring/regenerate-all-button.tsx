"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { regenerateAllAction } from "@/app/dashboard/hiring/actions"

export function RegenerateAllButton() {
  const [isPending, startTransition] = useTransition()

  function handleRegenerateAll() {
    startTransition(async () => {
      toast.info("Regenerating all recommendations...")
      const result = await regenerateAllAction()

      if ("error" in result) {
        toast.error(result.error)
      } else {
        toast.success(`Regenerated ${result.count} recommendations`)
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRegenerateAll}
      disabled={isPending}
    >
      <RefreshCw
        className={`size-4 mr-2 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Regenerating..." : "Regenerate All"}
    </Button>
  )
}
