import { connection } from "next/server"
import { getTranscriptsWithRubrics } from "@/lib/db/queries"
import { TranscriptsTable } from "@/components/dashboard/transcripts-table"

export default async function TranscriptsPage() {
  await connection()
  const transcripts = await getTranscriptsWithRubrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transcripts</h1>
        <p className="text-sm text-muted-foreground">
          Interviewer transcripts across all role families.
        </p>
      </div>
      <TranscriptsTable transcripts={transcripts} />
    </div>
  )
}
