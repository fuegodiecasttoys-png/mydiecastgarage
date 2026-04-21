import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { getSupabasePublicConfig } from "./supabaseEnv"

export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabasePublicConfig()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", options);
        },
      },
    }
  );
}

