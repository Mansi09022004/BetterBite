// RAG ingestion pipeline — run manually with `npm run rag:ingest`.
// This is a one-time (or run-when-the-doc-changes) offline job. It is NOT
// run per user question — the chat route (api/rag-chat.ts) only ever reads
// the rows this script writes.
//
// Stage 1: Load PDF
// Stage 2: Extract text
// Stage 3: Chunk text        (rag/chunk.ts)
// Stage 4: Generate embeddings + store in vector store (this file)

import './env.js'; // must load .env.local before the gemini/supabaseAdmin imports below
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error -- pdf-parse ships CJS with no ESM types entry
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { chunkText } from './chunk.js';
import { embedText, isGeminiConfigured } from '../api/_lib/gemini.js';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../api/_lib/supabaseAdmin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = path.join(__dirname, 'knowledge-base.pdf');
const SOURCE_NAME = 'knowledge-base.pdf';

async function main() {
  if (!isGeminiConfigured) {
    console.error('GEMINI_API_KEY is not set in .env.local — add it before running ingestion.');
    process.exit(1);
  }
  if (!isSupabaseAdminConfigured) {
    console.error('Supabase admin env vars are not set — check VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  // --- Stage 1: Load PDF ---
  console.log(`[ingest] loading ${PDF_PATH}`);
  const buffer = await readFile(PDF_PATH);

  // --- Stage 2: Extract text ---
  const parsed = await pdfParse(buffer);
  const rawText: string = parsed.text;
  console.log(`[ingest] extracted ${rawText.length} characters from ${parsed.numpages} page(s)`);

  // --- Stage 3: Chunk text ---
  const chunks = chunkText(rawText);
  console.log(`[ingest] split into ${chunks.length} chunks`);

  // --- Stage 4: Generate embeddings ---
  console.log('[ingest] generating embeddings...');
  const rows = [];
  for (const chunk of chunks) {
    const embedding = await embedText(chunk.content, 'RETRIEVAL_DOCUMENT');
    rows.push({
      content: chunk.content,
      embedding: JSON.stringify(embedding), // pgvector accepts a stringified array over the JS client
      chunk_index: chunk.chunkIndex,
      source: SOURCE_NAME,
    });
    process.stdout.write('.');
  }
  console.log('\n[ingest] embeddings generated');

  // --- Store in vector store (Supabase / pgvector) ---
  // Re-running ingestion should be idempotent: wipe this doc's old rows first.
  const { error: deleteError } = await supabaseAdmin.from('rag_chunks').delete().eq('source', SOURCE_NAME);
  if (deleteError) {
    console.error('[ingest] failed to clear old chunks:', deleteError.message);
    process.exit(1);
  }

  const { error: insertError } = await supabaseAdmin.from('rag_chunks').insert(rows);
  if (insertError) {
    console.error('[ingest] failed to insert chunks:', insertError.message);
    console.error('Did you run rag/schema.sql in the Supabase SQL Editor yet?');
    process.exit(1);
  }

  console.log(`[ingest] done — stored ${rows.length} chunks in the rag_chunks table.`);
}

main().catch((err) => {
  console.error('[ingest] unexpected error:', err);
  process.exit(1);
});
