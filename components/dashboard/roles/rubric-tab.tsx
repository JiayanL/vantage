"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { MarkdownContent } from "@/components/shared/markdown-content"
import type { ArtifactRow } from "@/lib/types/artifact"

type RubricTabProps = {
  rubricArtifact: ArtifactRow | null
}

export function RubricTab({ rubricArtifact }: RubricTabProps) {
  if (!rubricArtifact) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="size-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No rubric has been found for this role family yet.
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
          {rubricArtifact.title}
        </CardTitle>
        {rubricArtifact.source_ref && (
          <CardDescription>{rubricArtifact.source_ref}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <MarkdownContent content={rubricArtifact.content} />
      </CardContent>
    </Card>
  )
}
