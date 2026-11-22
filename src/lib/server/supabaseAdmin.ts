import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase-klient med service role-nyckeln. Den går förbi RLS, så den får
// ALDRIG importeras i klientkod. "server-only" ger build-fel om det händer.

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
