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
// Tried in order only if the main model is overloaded, rate-limited or unavailable.
const FALLBACK_GENERATION_MODELS = ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite'];
const GENERATE_TIMEOUT_MS = 4500; // keeps the whole chain inside Vercel's function time limit

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
  try {
    return await embedOnce(text, taskType);
  } catch (err) {
    // one quick retry for transient Gemini overload (429/500/503)
    const status = (err as { status?: number }).status;
    if (!status || !RETRYABLE_STATUSES.includes(status)) throw err;
    await new Promise((r) => setTimeout(r, 400));
    return embedOnce(text, taskType);
  }
}

async function embedOnce(text: string, taskType: EmbeddingTaskType): Promise<number[]> {
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
    throw Object.assign(new Error(`Gemini embedContent failed (${res.status}): ${await res.text()}`), {
      status: res.status,
    });
  }

  const data = await res.json();
  return data.embedding.values as number[];
}

/** One generateContent call. Throws an error carrying the HTTP status so callers can decide to retry. */
async function callGenerate(model: string, prompt: string): Promise<string> {
  const res = await fetch(`${API_BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
    signal: AbortSignal.timeout(GENERATE_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw Object.assign(new Error(`Gemini generateContent failed (${res.status}): ${await res.text()}`), {
      status: res.status,
    });
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  return text.trim();
}

const RETRYABLE_STATUSES = [404, 429, 500, 503];

/**
 * Sends a fully-constructed RAG prompt (context + question) to the LLM and
 * returns its answer text.
 *
 * Gemini sometimes answers 503 "high demand" or 429 (free-tier rate limit)
 * for a few seconds. Instead of showing the user an error, move on to the
 * next model in the chain, which is rarely busy at the same moment. A request
 * that hangs is cut off by the timeout and treated the same way.
 */
export async function generateAnswer(prompt: string): Promise<string> {
  const models = [GENERATION_MODEL, ...FALLBACK_GENERATION_MODELS];
  let lastError: unknown;

  for (const model of models) {
    try {
      return await callGenerate(model, prompt);
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number }).status;
      const isTimeout = (err as { name?: string }).name === 'TimeoutError';
      if (!isTimeout && !(status && RETRYABLE_STATUSES.includes(status))) throw err;
    }
  }
  throw lastError;
}
