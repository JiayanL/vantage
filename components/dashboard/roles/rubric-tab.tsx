"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import type { DraftRubric } from "@/lib/types/recommendation"

type RubricTabProps = {
  rubric: DraftRubric | null
}

function rubricToMarkdown(rubric: DraftRubric): string {
  let md = `${rubric.summary}\n\n`

  for (const change of rubric.changes) {
    md += `### ${change.dimension}\n\n`
    md += `**Current State:** ${change.current_state}\n\n`
    md += `**Recommended Change:** ${change.recommended_change}\n\n`
    md += `**Rationale:** ${change.rationale}\n\n`
  }

  return md
}

export function RubricTab({ rubric }: RubricTabProps) {
  if (!rubric) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="size-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No rubric has been generated for this role family yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="size-4" />
          Draft Rubric
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {rubricToMarkdown(rubric)}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}
