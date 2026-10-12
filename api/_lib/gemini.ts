// --- Stage 5 (embedding) & Stage 9 (generation) of the RAG pipeline. ---
// Both ingestion (rag/ingest.ts) and the live chat route (api/rag-chat.ts)
// share this one client so the SAME embedding model is used to embed the
// document chunks and the user's question — the two embeddings only live in
// the same vector space if they come from the same model.
//
// Calls the Gemini REST API directly (no SDK) to avoid version drift
// between an installed SDK and whatever models/params Google's API
// currently supports.

const apiKey = process.env.GEMINI_API_KEY;

export const isGeminiConfigured = Boolean(apiKey);

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 768; // must match the `vector(768)` column in rag/schema.sql
const GENERATION_MODEL = 'gemini-2.5-flash';

export type EmbeddingTaskType = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY';

/**
 * Embeds a single string of text into a 768-dim vector.
 *
 * `taskType` tells the model whether this text is a corpus chunk being
 * indexed or a search query being asked — Gemini's embedding model is
 * trained to place these two differently for the same underlying topic, so
 * passing the right one measurably improves query-to-chunk similarity
 * scores. Ingestion uses RETRIEVAL_DOCUMENT; the chat route uses
 * RETRIEVAL_QUERY.
 */
export async function embedText(text: string, taskType: EmbeddingTaskType): Promise<number[]> {
  const res = await fetch(`${API_BASE}/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType,
      outputDimensionality: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini embedContent failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return data.embedding.values as number[];
}

/** Sends a fully-constructed RAG prompt (context + question) to the LLM and returns its answer text. */
export async function generateAnswer(prompt: string): Promise<string> {
  const res = await fetch(`${API_BASE}/models/${GENERATION_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini generateContent failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  return text.trim();
}
