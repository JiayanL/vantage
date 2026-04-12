import { getAllArtifacts } from "@/lib/db/queries"
import { ArtifactsTable } from "@/components/dashboard/artifacts-table"

export default async function ArtifactsPage() {
  const artifacts = await getAllArtifacts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Artifacts</h1>
        <p className="text-sm text-muted-foreground">
          Interview transcripts, scorecards, and rubrics across all role
          families.
        </p>
      </div>
      <ArtifactsTable artifacts={artifacts} />
    </div>
  )
}
