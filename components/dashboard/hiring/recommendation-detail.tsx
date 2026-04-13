"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Quote, BookOpen, Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RecommendationRow } from "@/lib/types/recommendation"

type RecommendationDetailProps = {
  recommendation: RecommendationRow
  onEvidenceClick?: (artifactId: string) => void
  activeArtifactId?: string | null
}

export function RecommendationDetail({
  recommendation: rec,
  onEvidenceClick,
  activeArtifactId,
}: RecommendationDetailProps) {
  return (
    <div className="space-y-6">
      {/* Key Signals */}
      {rec.key_signals.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <FileText className="size-4" />
            Key Signals
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {rec.key_signals.map((signal, i) => (
              <li key={i}>{signal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reasoning */}
      {rec.reasoning_summary && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Reasoning</h4>
          <p className="text-sm text-muted-foreground leading-relaxed break-words">
            {rec.reasoning_summary}
          </p>
        </div>
      )}

      {/* Recommended Action */}
      {rec.recommended_action && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Recommended Action</h4>
          <p className="text-sm text-foreground bg-muted rounded-md px-3 py-2 break-words">
            {rec.recommended_action}
          </p>
        </div>
      )}

      {/* Supporting Evidence */}
      {rec.supporting_evidence.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Quote className="size-4" />
            Supporting Evidence
          </h4>
          <div className="space-y-3">
            {rec.supporting_evidence.map((ev, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border border-border bg-background p-3",
                  onEvidenceClick &&
                    "cursor-pointer transition-colors hover:border-primary/50",
                  activeArtifactId === ev.artifact_id &&
                    "border-primary bg-primary/5"
                )}
                onClick={
                  onEvidenceClick
                    ? () => onEvidenceClick(ev.artifact_id)
                    : undefined
                }
              >
                <p className="text-sm italic text-foreground break-words">
                  &ldquo;{ev.quote}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground mt-1 break-words">
                  {ev.locator_hint}
                  {ev.artifact_id && (
                    <span className="ml-2 text-xs">
                      Artifact: {ev.artifact_id.slice(0, 8)}...
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft Rubric */}
      {rec.draft_rubric && (
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="size-4" />
            Draft Rubric
          </h4>
          <p className="text-sm text-muted-foreground mb-2 break-words">
            {rec.draft_rubric.summary}
          </p>
          {rec.draft_rubric.changes.length > 0 && (
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table className="table-fixed w-full">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[25%]" />
                  <col className="w-[30%]" />
                  <col className="w-[25%]" />
                </colgroup>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-normal">Dimension</TableHead>
                    <TableHead className="whitespace-normal">Current State</TableHead>
                    <TableHead className="whitespace-normal">Recommended Change</TableHead>
                    <TableHead className="whitespace-normal">Rationale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rec.draft_rubric.changes.map((change, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm whitespace-normal break-words">
                        {change.dimension}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-normal break-words">
                        {change.current_state}
                      </TableCell>
                      <TableCell className="text-sm whitespace-normal break-words">
                        {change.recommended_change}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-normal break-words">
                        {change.rationale}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Draft Guidance */}
      {rec.draft_guidance && (
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Compass className="size-4" />
            Draft Guidance
          </h4>
          <p className="text-sm text-muted-foreground mb-2 break-words">
            {rec.draft_guidance.summary}
          </p>
          {rec.draft_guidance.suggestions.length > 0 && (
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table className="table-fixed w-full">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[25%]" />
                  <col className="w-[30%]" />
                  <col className="w-[25%]" />
                </colgroup>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-normal">Area</TableHead>
                    <TableHead className="whitespace-normal">Current State</TableHead>
                    <TableHead className="whitespace-normal">Recommended Change</TableHead>
                    <TableHead className="whitespace-normal">Rationale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rec.draft_guidance.suggestions.map((suggestion, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm whitespace-normal break-words">
                        {suggestion.area}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-normal break-words">
                        {suggestion.current_state}
                      </TableCell>
                      <TableCell className="text-sm whitespace-normal break-words">
                        {suggestion.recommended_change}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-normal break-words">
                        {suggestion.rationale}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Confidence Label & Freshness */}
      <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
        {rec.confidence_label && (
          <span>Confidence: {rec.confidence_label}</span>
        )}
        <span>
          Generated:{" "}
          {new Date(rec.generated_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  )
}
