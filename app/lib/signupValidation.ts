import type { SupabaseClient } from "@supabase/supabase-js";

/** Shown under the password field on signup. */
export const PASSWORD_RULES_SUMMARY = "At least 6 characters.";

export function validateSignupPassword(password: string): { ok: true } | { ok: false; message: string } {
  if (password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }
  return { ok: true };
}

/**
 * Uses DB RPC `public.is_username_available` (security definer) so signup works
 * even when anonymous users cannot read `public.profiles` under RLS.
 */
export async function fetchUsernameAvailable(
  supabase: SupabaseClient,
  normalizedUsername: string
): Promise<
  | { ok: true; available: boolean }
  | { ok: false; message: string }
> {
  const { data, error } = await supabase.rpc("is_username_available", {
    p_username: normalizedUsername,
  });
  if (error) {
    return { ok: false, message: error.message || "Could not verify username." };
  }
  if (typeof data !== "boolean") {
    return { ok: false, message: "Could not verify username." };
  }
  return { ok: true, available: data };
}
