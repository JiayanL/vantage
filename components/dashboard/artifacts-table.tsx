"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ArtifactRow } from "@/lib/types/artifact"

const typeVariant: Record<
  ArtifactRow["artifact_type"],
  "default" | "secondary" | "outline"
> = {
  transcript: "default",
  scorecard: "secondary",
  rubric: "outline",
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function MarkdownContent({ content }: { content: string | null }) {
  if (!content) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No content available for this artifact.
      </p>
    )
  }

  return (
    <div className="artifact-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ children }) => {
            const text = String(children)
            if (text.startsWith("Interviewer")) {
              return <strong className="speaker-interviewer">{children}</strong>
            }
            if (text.startsWith("Candidate")) {
              return <strong className="speaker-candidate">{children}</strong>
            }
            return <strong>{children}</strong>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

type Props = {
  artifacts: ArtifactRow[]
}

export function ArtifactsTable({ artifacts }: Props) {
  const [selectedArtifact, setSelectedArtifact] =
    useState<ArtifactRow | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Artifacts</CardTitle>
          <CardDescription>
            {artifacts.length} artifacts across all role families
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Role Family</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artifacts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    No artifacts found.
                  </TableCell>
                </TableRow>
              ) : (
                artifacts.map((artifact) => (
                  <TableRow
                    key={artifact.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedArtifact(artifact)}
                  >
                    <TableCell className="font-medium">
                      {artifact.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeVariant[artifact.artifact_type]}>
                        {artifact.artifact_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {artifact.role_family_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(
                        artifact.captured_at ?? artifact.created_at
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={selectedArtifact !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedArtifact(null)
        }}
      >
        <SheetContent side="right" className="data-[side=right]:sm:max-w-3xl overflow-y-auto">
          {selectedArtifact && (
            <>
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle>{selectedArtifact.title}</SheetTitle>
                <SheetDescription>
                  <Badge
                    variant={typeVariant[selectedArtifact.artifact_type]}
                  >
                    {selectedArtifact.artifact_type}
                  </Badge>{" "}
                  <span>{selectedArtifact.role_family_name}</span>
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-4">
                <MarkdownContent content={selectedArtifact.content} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
