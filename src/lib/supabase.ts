import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { FEED_LIMIT, type Post } from "./posts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function make(): SupabaseClient {
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  // No sign-in on this site: every visitor uses the publishable key, limited by RLS to reading and adding posts.
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

let browserClient: SupabaseClient | undefined;
/** One shared client in the browser so the realtime socket is opened once. */
export function getSupabase(): SupabaseClient {
  if (typeof window === "undefined") return make();
  browserClient ??= make();
  return browserClient;
}

export async function fetchLatestPosts(): Promise<{ posts: Post[]; error: string | null }> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("id, author_name, message, photo_url, created_at")
    .order("created_at", { ascending: false })
    .limit(FEED_LIMIT);
  if (error) return { posts: [], error: error.message };
  return { posts: (data ?? []) as Post[], error: null };
}
