"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownContent({ content }: { content: string | null }) {
  if (!content) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No content available.
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
