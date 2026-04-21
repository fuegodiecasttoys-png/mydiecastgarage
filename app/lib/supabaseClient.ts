import { createClient } from "@supabase/supabase-js"

/**
 * Vercel / `next build` prerenders pages that import this module. If env vars are
 * missing during build, `createClient(undefined, …)` throws ("supabaseUrl is required").
 * Use placeholders only when vars are absent; set real values in Vercel (Production).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

const supabaseUrl =
  url && url.length > 0 ? url : "https://placeholder.supabase.co"
const supabaseAnonKey =
  anonKey && anonKey.length > 0
    ? anonKey
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.build-placeholder"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)