-- RAG vector store schema. Run this once in the Supabase dashboard
-- (Project -> SQL Editor -> New query -> paste -> Run).
-- This only ADDS a new table/function/index — it does not touch
-- profiles/addresses/orders or any other existing table.

-- Stage 4 of the RAG pipeline: vector storage. pgvector is a Postgres
-- extension Supabase ships built-in; this just turns it on for this project.
create extension if not exists vector;

create table if not exists rag_chunks (
  id bigserial primary key,
  content text not null,
  embedding vector(768) not null, -- 768 dims = Gemini text-embedding-004
  chunk_index integer not null,
  source text not null default 'knowledge-base.pdf',
  created_at timestamptz not null default now()
);

-- No approximate-search index (ivfflat/hnsw) here on purpose: those only
-- pay off once you have thousands of rows, and an ivfflat index tuned for
-- a large table (lists=100) on a corpus this small actually produces WRONG
-- results — its clustering degenerates with so few rows, and a query can
-- land on an empty cluster and return zero matches even when relevant rows
-- exist. At this size, Postgres does an exact sequential scan over
-- rag_chunks, which is both correct and effectively instant. Add a proper
-- ivfflat/hnsw index later if this table grows into the thousands of rows.

-- Stage 6 of the RAG pipeline: similarity search. Cosine distance (<=>) is
-- what pgvector uses; "similarity" here is 1 - distance, so higher = closer.
create or replace function match_rag_chunks(
  query_embedding vector(768),
  match_count int default 4
)
returns table (
  id bigint,
  content text,
  chunk_index int,
  source text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    chunk_index,
    source,
    1 - (embedding <=> query_embedding) as similarity
  from rag_chunks
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Locked down: only the server-side service_role key (used by /api routes,
-- never shipped to the browser) can read or write this table. Same trust
-- model as the existing orders table.
alter table rag_chunks enable row level security;
