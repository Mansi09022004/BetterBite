import type { VercelRequest, VercelResponse } from '@vercel/node';
import { embedText, generateAnswer, isGeminiConfigured } from './_lib/gemini.js';
import { supabaseAdmin, isSupabaseAdminConfigured } from './_lib/supabaseAdmin.js';

// The live RAG query path. Nothing here re-processes the PDF — it only
// reads the chunk rows that `npm run rag:ingest` already wrote.
//
// Stage 6: embed the question, then similarity-search the stored chunks
// Stage 7: retrieve the most relevant chunks
// Stage 8: build a prompt out of (retrieved context + question)
// Stage 9: send that prompt to the LLM and return its grounded answer

interface ChatRequestBody {
  message?: string;
}

interface RetrievedChunk {
  id: number;
  content: string;
  chunk_index: number;
  source: string;
  similarity: number;
}

const MATCH_COUNT = 4;
// Below this cosine-similarity score, we don't trust the retrieval enough
// to even ask the LLM — this is what keeps out-of-scope questions from
// getting an improvised answer instead of the fallback line.
const SIMILARITY_THRESHOLD = 0.55;

const FALLBACK_ANSWER = "I couldn't find that information in the provided document.";

function buildPrompt(question: string, chunks: RetrievedChunk[]): string {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join('\n\n');

  return `You are the BetterBite Assistant, answering questions about the BetterBite protein-bites brand.

Answer the user's question using ONLY the context below. Do not use outside knowledge and do not make anything up.
If the context does not contain the answer, respond with exactly: "${FALLBACK_ANSWER}"
Keep the answer short and conversational.

Context:
${context}

Question: ${question}

Answer:`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!isGeminiConfigured) {
    res.status(500).json({ error: 'RAG chatbot is not configured yet — add GEMINI_API_KEY.' });
    return;
  }
  if (!isSupabaseAdminConfigured) {
    res.status(500).json({ error: 'RAG chatbot is not configured yet — Supabase admin env vars are missing.' });
    return;
  }

  const body = req.body as ChatRequestBody;
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!message) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  try {
    // --- Stage 6: embed the question ---
    const queryEmbedding = await embedText(message, 'RETRIEVAL_QUERY');

    // --- Stage 6/7: similarity search + retrieve top matches ---
    const { data, error } = await supabaseAdmin.rpc('match_rag_chunks', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_count: MATCH_COUNT,
    });

    if (error) {
      console.error('[rag-chat] retrieval failed', error);
      res.status(500).json({ error: 'Could not search the knowledge base. Please try again.' });
      return;
    }

    const chunks = (data ?? []) as RetrievedChunk[];
    const relevantChunks = chunks.filter((c) => c.similarity >= SIMILARITY_THRESHOLD);

    if (relevantChunks.length === 0) {
      res.status(200).json({ answer: FALLBACK_ANSWER, sources: [] });
      return;
    }

    // --- Stage 8: build the grounded prompt ---
    const prompt = buildPrompt(message, relevantChunks);

    // --- Stage 9: generate the answer ---
    const answer = await generateAnswer(prompt);

    res.status(200).json({
      answer,
      sources: relevantChunks.map((c) => ({
        chunkIndex: c.chunk_index,
        similarity: Math.round(c.similarity * 1000) / 1000,
        snippet: c.content.length > 220 ? `${c.content.slice(0, 220)}…` : c.content,
      })),
    });
  } catch (err) {
    console.error('[rag-chat] unexpected error', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
