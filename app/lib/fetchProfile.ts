import { supabase } from "./supabaseClient";

/**
 * Loads a row from `profiles` for the signed-in user's id.
 * Defaults to `plan` and `is_active`; pass a custom `select` for more columns.
 */
export async function fetchProfile(
  userId: string,
  select: string = "plan, is_active"
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(select)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("fetchProfile:", error.message);
    return null;
  }

  return (data as Record<string, unknown> | null) ?? null;
}

/** Pro features that require an active subscription (DB: plan + is_active). */
export function isActiveProRow(
  row: { plan?: unknown; is_active?: unknown } | null | undefined
): boolean {
  return row?.plan === "pro" && row?.is_active === true;
}
