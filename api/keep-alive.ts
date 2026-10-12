import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin, isSupabaseAdminConfigured } from './_lib/supabaseAdmin.js';

// Called once a day by a Vercel Cron job (see vercel.json). Supabase's free
// tier pauses a project after a stretch of no activity, which takes down
// login, checkout and the RAG chatbot. A tiny read query each day counts as
// activity and keeps the project awake.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!isSupabaseAdminConfigured) {
    res.status(500).json({ ok: false, error: 'Supabase is not configured.' });
    return;
  }

  const { error } = await supabaseAdmin.from('rag_chunks').select('id', { count: 'exact', head: true });

  if (error) {
    console.error('[keep-alive] ping failed', error);
    res.status(500).json({ ok: false });
    return;
  }

  res.status(200).json({ ok: true });
}
