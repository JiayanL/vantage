import OpenAI from "openai";
import type { RecommendationPayload } from "./schema";
import { recommendationJsonSchema } from "./schema";
import { SYSTEM_PROMPT } from "./prompt";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) _client = new OpenAI({ maxRetries: 4 });
  return _client;
}

// ~100k tokens of artifact content; 1 token ≈ 4 chars
const MAX_ARTIFACT_CHARS = 100_000 * 4;

type Artifact = {
  id: string;
  artifact_type: string;
  title: string;
  content: string | null;
  source_ref: string | null;
};

type RoleFamily = {
  id: string;
  name: string;
};

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function prepareUserMessage(roleFamily: RoleFamily, artifacts: Artifact[]): string {
  // 1. Filter out artifacts with no content
  const withContent: Artifact[] = [];
  for (const a of artifacts) {
    if (a.content === null || a.content === "") {
      console.warn(
        `Dropping artifact [${a.id}] "${a.title}" — content is ${a.content === null ? "null" : "empty"}`
      );
    } else {
      withContent.push(a);
    }
  }

  if (withContent.length === 0) {
    throw new Error(`No artifacts with content for role family: ${roleFamily.name}`);
  }

  // 2. Token-budget truncation
  const totalChars = withContent.reduce((sum, a) => sum + a.content!.length, 0);
  let truncationNote = "";

  if (totalChars > MAX_ARTIFACT_CHARS) {
    console.warn(
      `Total artifact content (${totalChars} chars) exceeds budget (${MAX_ARTIFACT_CHARS} chars). Truncating proportionally.`
    );

    // Proportional truncation: each artifact gets a share of the budget
    // proportional to its current share, but we shrink only from the longest.
    const ratio = MAX_ARTIFACT_CHARS / totalChars;
    for (const a of withContent) {
      const original = a.content!.length;
      const allowed = Math.floor(original * ratio);
      if (allowed < original) {
        a.content = a.content!.slice(0, allowed) + `\n[TRUNCATED — original length: ${original} chars]`;
      }
    }
    truncationNote = `\nNote: Artifacts were truncated to fit within the token budget.\n`;
  }

  // 3. Count artifact types
  const counts: Record<string, number> = {};
  for (const a of withContent) {
    const t = a.artifact_type.toLowerCase();
    counts[t] = (counts[t] ?? 0) + 1;
  }
  const breakdown = ["transcripts", "scorecards", "rubrics"]
    .filter((t) => (counts[t] ?? 0) > 0)
    .map((t) => `${counts[t]} ${t}`)
    .join(", ");

  // 4. Build message
  const header = [
    `Role Family: ${roleFamily.name}`,
    `Artifacts: ${withContent.length} (${breakdown})`,
    truncationNote,
  ].join("\n");

  const body = withContent
    .map(
      (a) =>
        `--- ARTIFACT [${a.id}] ---\nType: ${a.artifact_type}\nTitle: ${a.title}\nSource: ${a.source_ref ?? "N/A"}\n\n${a.content}`
    )
    .join("\n\n");

  return `${header}\n${body}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateRecommendation(
  roleFamily: RoleFamily,
  artifacts: Artifact[]
): Promise<{ parsed: RecommendationPayload; raw: unknown }> {
  const userMessage = prepareUserMessage(roleFamily, artifacts);

  const response = await getClient().chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "developer", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: recommendationJsonSchema,
  });

  const choice = response.choices[0];
  const finishReason = choice?.finish_reason;

  if (finishReason === "length") {
    throw new Error(
      "Model output truncated (finish_reason=length). Artifact set may be too large."
    );
  }
  if (finishReason === "content_filter") {
    throw new Error("Response blocked by content filter.");
  }

  const message = choice?.message;
  if (!message?.content) {
    throw new Error("Empty response from model.");
  }

  const parsed = JSON.parse(message.content) as RecommendationPayload;

  return { parsed, raw: response };
}
