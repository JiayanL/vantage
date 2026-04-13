"use client"

import { useState, useTransition, useCallback, useRef } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RecommendationDetail } from "@/components/dashboard/hiring/recommendation-detail"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { getArtifactAction } from "@/app/dashboard/hiring/actions"
import type { RecommendationRow } from "@/lib/types/recommendation"
import type { ArtifactRow } from "@/lib/types/artifact"

type RecommendationSheetContentProps = {
  recommendation: RecommendationRow
}

export function RecommendationSheetContent({
  recommendation,
}: RecommendationSheetContentProps) {
  const [artifact, setArtifact] = useState<ArtifactRow | null>(null)
  const [isPending, startTransition] = useTransition()
  const cacheRef = useRef<Map<string, ArtifactRow>>(new Map())

  const handleEvidenceClick = useCallback(
    (artifactId: string) => {
      const cached = cacheRef.current.get(artifactId)
      if (cached) {
        setArtifact(cached)
        return
      }

      startTransition(async () => {
        const result = await getArtifactAction(artifactId)
        if ("artifact" in result && result.artifact) {
          cacheRef.current.set(artifactId, result.artifact)
          setArtifact(result.artifact)
        } else if ("error" in result) {
          toast.error(result.error)
        }
      })
    },
    []
  )

  const handleCloseTranscript = useCallback(() => {
    setArtifact(null)
  }, [])

  const showTranscript = artifact !== null || isPending

  return (
    <div
      className={
        showTranscript
          ? "flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-hidden"
          : "flex-1 min-h-0 overflow-y-auto"
      }
    >
      <div className={showTranscript ? "min-w-0 overflow-y-auto px-4 pb-4" : "min-w-0 px-4 pb-4"}>
        <RecommendationDetail
          recommendation={recommendation}
          onEvidenceClick={handleEvidenceClick}
          activeArtifactId={artifact?.id ?? null}
        />
      </div>

      {showTranscript && (
        <div className="min-w-0 overflow-y-auto lg:border-l lg:border-border lg:pl-6 pr-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Source Transcript
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={handleCloseTranscript}
            >
              <X className="size-4" />
              <span className="sr-only">Close transcript</span>
            </Button>
          </div>
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              {artifact?.title && (
                <p className="text-sm font-medium mb-2">{artifact.title}</p>
              )}
              <MarkdownContent content={artifact?.content ?? null} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
