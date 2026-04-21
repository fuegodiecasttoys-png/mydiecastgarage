import { createClient } from "@supabase/supabase-js"
import { getSupabasePublicConfig } from "./supabaseEnv"

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabasePublicConfig()

export const supabase = createClient(supabaseUrl, supabaseAnonKey)