import type { SupabaseClient } from "@supabase/supabase-js";

/** Client-side rules; keep aligned with Supabase Auth password policy in dashboard. */

export const PASSWORD_RULES_SUMMARY =
  "At least 8 characters, with uppercase, lowercase, and a number.";

export function validateSignupPassword(password: string): { ok: true } | { ok: false; message: string } {
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }
  if (!/[a-z]/.test(password)) {
    return { ok: false, message: "Password must include a lowercase letter." };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, message: "Password must include an uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: "Password must include a number." };
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
