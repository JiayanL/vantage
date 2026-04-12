"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import {
  regenerateRoleFamily,
  regenerateAll,
  createArtifact,
} from "@/lib/services/recommendations"

const regenerateSchema = z.object({
  roleFamilyId: z.string().uuid(),
})

export async function regenerateRoleFamilyAction(formData: FormData) {
  const parsed = regenerateSchema.safeParse({
    roleFamilyId: formData.get("roleFamilyId"),
  })

  if (!parsed.success) {
    return { error: "Invalid role family ID" }
  }

  try {
    const rec = await regenerateRoleFamily(parsed.data.roleFamilyId)
    revalidatePath("/dashboard/hiring")
    revalidatePath("/dashboard")
    return { success: true, id: rec.id }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Regeneration failed",
    }
  }
}

export async function regenerateAllAction() {
  try {
    const results = await regenerateAll()
    revalidatePath("/dashboard/hiring")
    revalidatePath("/dashboard")
    return { success: true, count: results.length }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Batch regeneration failed",
    }
  }
}

const artifactSchema = z.object({
  role_family_id: z.string().uuid(),
  artifact_type: z.enum(["transcript", "scorecard", "rubric"]),
  title: z.string().min(1).max(500),
  source_ref: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  captured_at: z.string().datetime().nullable().optional(),
})

export async function createArtifactAction(formData: FormData) {
  const parsed = artifactSchema.safeParse({
    role_family_id: formData.get("role_family_id"),
    artifact_type: formData.get("artifact_type"),
    title: formData.get("title"),
    source_ref: formData.get("source_ref") || null,
    content: formData.get("content") || null,
    captured_at: formData.get("captured_at") || null,
  })

  if (!parsed.success) {
    return { error: "Invalid artifact data" }
  }

  try {
    const artifact = await createArtifact(parsed.data)
    revalidatePath("/dashboard/hiring")
    revalidatePath("/dashboard/artifacts")
    return { success: true, id: artifact.id }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create artifact",
    }
  }
}
