"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { regenerateRoleFamilyAction } from "@/app/dashboard/hiring/actions"

type RegenerateButtonProps = {
  roleFamilyId: string
}

export function RegenerateButton({ roleFamilyId }: RegenerateButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleRegenerate() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("roleFamilyId", roleFamilyId)
      const result = await regenerateRoleFamilyAction(formData)

      if ("error" in result) {
        toast.error(result.error)
      } else {
        toast.success("Recommendation regenerated")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRegenerate}
      disabled={isPending}
    >
      <RefreshCw
        className={`size-4 ${isPending ? "animate-spin" : ""}`}
      />
      <span className="sr-only">Regenerate</span>
    </Button>
  )
}
