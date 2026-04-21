/**
 * Public Supabase config for browser + server helpers.
 * During `next build` / prerender, env may be missing on the host (e.g. Vercel not configured yet).
 * Invalid or partial values should not crash the build — use placeholders until real env is set.
 */
const URL_PLACEHOLDER = "https://placeholder.supabase.co"
/** Well-formed JWT shape (anon keys are JWTs); satisfies createClient / validateSupabaseUrl at build time. */
const ANON_PLACEHOLDER =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIn0.placeholder-signature"

function isValidPublicSupabaseUrl(url: string): boolean {
  if (!url || !/^https?:\/\//i.test(url)) return false
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

function isValidAnonKey(key: string): boolean {
  return key.length >= 32
}

export function getSupabasePublicConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ""

  if (isValidPublicSupabaseUrl(url) && isValidAnonKey(anonKey)) {
    return { url, anonKey }
  }

  return { url: URL_PLACEHOLDER, anonKey: ANON_PLACEHOLDER }
}
