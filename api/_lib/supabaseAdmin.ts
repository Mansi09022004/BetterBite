import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(url && serviceRoleKey);

if (!isSupabaseAdminConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[BetterBite api] Supabase admin client not configured — set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
}

/**
 * Server-only Supabase client using the service_role key. This bypasses Row
 * Level Security entirely, so it must NEVER be imported into anything that
 * ships to the browser — only from files under /api. The server is the
 * trusted writer for orders (verified payment -> insert), not the client.
 */
export const supabaseAdmin = createClient(url || 'https://placeholder.supabase.co', serviceRoleKey || 'placeholder', {
  auth: { persistSession: false },
  // supabase-js always constructs a Realtime client, which needs a WebSocket
  // implementation. Node's global WebSocket only exists on Node 22+, so this
  // polyfills it for older Node runtimes (we never use realtime features here).
  realtime: { transport: WebSocket as any },
});
