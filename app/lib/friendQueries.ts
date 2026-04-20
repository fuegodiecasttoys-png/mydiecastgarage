import type { SupabaseClient } from "@supabase/supabase-js";

export type FriendRequestRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

export async function fetchProfileByUsername(
  supabase: SupabaseClient,
  username: string
): Promise<{ id: string; username: string } | null> {
  const clean = username.trim().toLowerCase();
  if (!clean) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", clean)
    .maybeSingle();
  if (error || !data) return null;
  return data as { id: string; username: string };
}

/** True if there is an accepted friend_requests row between the two user ids (profiles.id). */
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
