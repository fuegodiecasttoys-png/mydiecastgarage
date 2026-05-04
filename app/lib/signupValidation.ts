import type { SupabaseClient } from "@supabase/supabase-js";

/** Minimum length (same rules: uppercase, digit, special character). */
export const MIN_SIGNUP_PASSWORD_LENGTH = 6;

/** Shown under the password field on signup. */
export const PASSWORD_RULES_SUMMARY = `At least ${MIN_SIGNUP_PASSWORD_LENGTH} characters, one uppercase letter, one number, and one special character.`;

export function validateSignupPassword(password: string): { ok: true } | { ok: false; message: string } {
  if (password.length < MIN_SIGNUP_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `Password must be at least ${MIN_SIGNUP_PASSWORD_LENGTH} characters.`,
    };
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
 * Checks `public.profiles` for an existing row with the same normalized username.
 * Requires SELECT on `profiles` (or a permissive RLS policy) for the anon role used at signup.
 */
export async function fetchUsernameAvailable(
  supabase: SupabaseClient,
  normalizedUsername: string
): Promise<
  | { ok: true; available: boolean }
  | { ok: false; message: string }
> {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message || "Could not verify username." };
  }
  if (data) {
    return { ok: true, available: false };
  }
  return { ok: true, available: true };
}
