import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const isTwitterCallback = typeof window !== 'undefined' && 
    window.location.pathname.includes('/twitter-callback');

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        flowType: isTwitterCallback ? 'implicit' : 'pkce',
        detectSessionInUrl: !isTwitterCallback,
        persistSession: true,
      }
    }
  );
}