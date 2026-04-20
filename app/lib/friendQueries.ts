import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isPublicUsername,
  isValidUsernameFormat,
  normalizeUsernameInput,
} from "./profileUsername";

export type FriendRequestRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

/** Resolved by `profiles.username` only; `name` is display-only. */
export type ProfileByUsername = {
  user_id: string;
  username: string;
  name: string | null;
};

export async function fetchProfileByUsername(
  supabase: SupabaseClient,
  username: string
): Promise<ProfileByUsername | null> {
  const clean = normalizeUsernameInput(username);
  if (!clean || !isValidUsernameFormat(clean)) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, username, name")
    .eq("username", clean)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as { user_id: string; username: string | null; name: string | null };
  if (!isPublicUsername(row.username)) return null;
  return {
    user_id: row.user_id,
    username: normalizeUsernameInput(row.username as string),
    name: row.name?.trim() || null,
  };
}

/** True if there is an accepted friend_requests row between the two auth user ids (profiles.user_id). */
export async function areFriends(
  supabase: SupabaseClient,
  a: string,
  b: string
): Promise<boolean> {
  if (a === b) return false;
  const { data: d1 } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("status", "accepted")
    .eq("sender_id", a)
    .eq("receiver_id", b)
    .maybeSingle();
  if (d1) return true;
  const { data: d2 } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("status", "accepted")
    .eq("sender_id", b)
    .eq("receiver_id", a)
    .maybeSingle();
  return !!d2;
}

export function otherParticipantId(row: FriendRequestRow, me: string): string {
  return row.sender_id === me ? row.receiver_id : row.sender_id;
}
