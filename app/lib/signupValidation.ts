import type { SupabaseClient } from "@supabase/supabase-js";

/** Shown under the password field on signup. */
export const PASSWORD_RULES_SUMMARY =
  "At least 6 characters, one uppercase letter, one number, and one special character.";

export function validateSignupPassword(password: string): { ok: true } | { ok: false; message: string } {
  if (password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, message: "Password must include at least one uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: "Password must include at least one number." };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { ok: false, message: "Password must include at least one special character." };
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
