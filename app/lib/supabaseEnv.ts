/**
 * Public Supabase config for browser + server helpers.
 * Missing/invalid env vars should fail fast with a clear error.
 */

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

  if (!isValidPublicSupabaseUrl(url)) {
    throw new Error("Missing or invalid NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!isValidAnonKey(anonKey)) {
    throw new Error("Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return { url, anonKey }
}
