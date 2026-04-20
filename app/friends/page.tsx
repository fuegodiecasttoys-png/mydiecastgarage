"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import {
  areFriends,
  fetchProfileByUsername,
  otherParticipantId,
  type FriendRequestRow,
} from "../lib/friendQueries";
import { t } from "../ui/dv-tokens";
import {
  dvGhostButton,
  dvListCard,
  dvPageShell,
  dvInput,
  dvPrimaryButton,
  dvDisplayFont,
} from "../ui/dv-visual";
import { FullPageLoading } from "../components/FullPageLoading";

type ProfileMini = { id: string; username: string };

export default function FriendsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [myUsername, setMyUsername] = useState<string>("");

  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [incoming, setIncoming] = useState<FriendRequestRow[]>([]);
  const [incomingNames, setIncomingNames] = useState<Record<string, string>>({});

  const [outgoing, setOutgoing] = useState<FriendRequestRow[]>([]);
  const [outgoingNames, setOutgoingNames] = useState<Record<string, string>>({});

  const [friends, setFriends] = useState<FriendRequestRow[]>([]);
  const [friendNames, setFriendNames] = useState<Record<string, string>>({});

  const loadAll = useCallback(async (uid: string) => {
    const { data: inc } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("receiver_id", uid)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const incomingRows = (inc as FriendRequestRow[]) ?? [];
    setIncoming(incomingRows);

    const sids = [...new Set(incomingRows.map((r) => r.sender_id))];
    if (sids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, username").in("id", sids);
      const map: Record<string, string> = {};
      (profs as ProfileMini[] | null)?.forEach((p) => {
        map[p.id] = p.username;
      });
      setIncomingNames(map);
    } else {
      setIncomingNames({});
    }

    const { data: out } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("sender_id", uid)
      .order("created_at", { ascending: false });

    const outgoingRows = (out as FriendRequestRow[]) ?? [];
    setOutgoing(outgoingRows);

    const rids = [...new Set(outgoingRows.map((r) => r.receiver_id))];
    if (rids.length) {
      const { data: profs2 } = await supabase.from("profiles").select("id, username").in("id", rids);
      const map2: Record<string, string> = {};
      (profs2 as ProfileMini[] | null)?.forEach((p) => {
        map2[p.id] = p.username;
      });
      setOutgoingNames(map2);
    } else {
      setOutgoingNames({});
    }

    const { data: acc } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("status", "accepted")
      .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
      .order("created_at", { ascending: false });

    const friendRows = (acc as FriendRequestRow[]) ?? [];
    setFriends(friendRows);

    const otherIds = [...new Set(friendRows.map((r) => otherParticipantId(r, uid)))];
    if (otherIds.length) {
      const { data: profs3 } = await supabase.from("profiles").select("id, username").in("id", otherIds);
      const map3: Record<string, string> = {};
      (profs3 as ProfileMini[] | null)?.forEach((p) => {
        map3[p.id] = p.username;
      });
      setFriendNames(map3);
    } else {
      setFriendNames({});
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (cancelled) return;
      setMyId(user.id);

      const { data: meProf } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled && meProf?.username) setMyUsername(meProf.username as string);

      await loadAll(user.id);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, loadAll]);

  async function handleSendRequest() {
    if (!myId) return;
    setMessage(null);
    const clean = search.trim().toLowerCase();
    if (!clean) {
      setMessage("Enter a username.");
      return;
    }

    setBusy(true);
    try {
      const target = await fetchProfileByUsername(supabase, clean);
      if (!target) {
        setMessage("User not found.");
        return;
      }
      if (target.id === myId) {
        setMessage("You cannot add yourself.");
        return;
      }

      if (await areFriends(supabase, myId, target.id)) {
        setMessage("You are already friends with this user.");
        return;
      }

      const { data: pend1 } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("status", "pending")
        .eq("sender_id", myId)
        .eq("receiver_id", target.id)
        .maybeSingle();
      if (pend1) {
        setMessage("A request is already pending to this user.");
        return;
      }

      const { data: pend2 } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("status", "pending")
        .eq("sender_id", target.id)
        .eq("receiver_id", myId)
        .maybeSingle();
      if (pend2) {
        setMessage("This user already sent you a request — check Incoming.");
        return;
      }

      const { error } = await supabase.from("friend_requests").insert({
        sender_id: myId,
        receiver_id: target.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          setMessage("A pending request already exists.");
        } else {
          setMessage(error.message);
        }
        return;
      }

      setSearch("");
      setMessage("Request sent.");
      await loadAll(myId);
    } finally {
      setBusy(false);
    }
  }

  async function handleRespond(row: FriendRequestRow, status: "accepted" | "rejected") {
    if (!myId) return;
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from("friend_requests")
        .update({ status })
        .eq("id", row.id)
        .eq("receiver_id", myId)
        .eq("status", "pending");
      if (error) {
        setMessage(error.message);
        return;
      }
      await loadAll(myId);
    } finally {
      setBusy(false);
    }
  }

  if (!ready || !myId) {
    return <FullPageLoading label="Loading friends..." />;
  }

  const sectionTitle = (text: string) => (
    <h2
      style={{
        margin: "0 0 12px",
        fontFamily: dvDisplayFont,
        fontSize: 18,
        fontWeight: 700,
        color: t.textPrimary,
      }}
    >
      {text}
    </h2>
  );

  return (
    <div style={{ ...dvPageShell, position: "relative", padding: 20 }}>
      <Link href="/" style={{ ...dvGhostButton, textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
        ← Home
      </Link>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1
          style={{
            margin: "0 0 6px",
            fontFamily: dvDisplayFont,
            fontSize: 26,
            fontWeight: 700,
            color: t.textPrimary,
          }}
        >
          Friends
        </h1>
        <p style={{ margin: "0 0 22px", color: t.textSecondary, fontSize: 14, lineHeight: 1.5 }}>
          Add collectors by username. When they accept, you can view each other&apos;s garages
          (read-only).
        </p>
        {myUsername ? (
          <p style={{ margin: "0 0 20px", color: t.textMuted, fontSize: 13 }}>
            Your username: <strong style={{ color: t.orange300 }}>{myUsername}</strong>
          </p>
        ) : null}

        {sectionTitle("Find user")}
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...dvInput, flex: 1, minWidth: 160 }}
            autoComplete="off"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleSendRequest()}
            style={{ ...dvPrimaryButton, width: "auto", minWidth: 120 }}
          >
            Send request
          </button>
        </div>
        {message ? (
          <p style={{ color: t.textSecondary, fontSize: 13, marginBottom: 16 }}>{message}</p>
        ) : null}

        {sectionTitle("Incoming requests")}
        {incoming.length === 0 ? (
          <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>No pending requests.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
            {incoming.map((row) => (
              <div key={row.id} style={{ ...dvListCard, flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ fontWeight: 700, color: t.textPrimary, marginBottom: 10 }}>
                  @{incomingNames[row.sender_id] ?? "…"}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleRespond(row, "accepted")}
                    style={{ ...dvPrimaryButton, flex: 1 }}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleRespond(row, "rejected")}
                    style={{ ...dvGhostButton, flex: 1 }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sectionTitle("Sent requests")}
        {outgoing.filter((r) => r.status === "pending").length === 0 ? (
          <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>No outgoing pending.</p>
        ) : (
          <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
            {outgoing
              .filter((r) => r.status === "pending")
              .map((row) => (
                <div key={row.id} style={{ ...dvListCard, justifyContent: "space-between" }}>
                  <span style={{ color: t.textPrimary, fontWeight: 600 }}>
                    @{outgoingNames[row.receiver_id] ?? "…"}
                  </span>
                  <span style={{ color: t.orange300, fontSize: 12, fontWeight: 600 }}>Pending</span>
                </div>
              ))}
          </div>
        )}

        {sectionTitle("Friends")}
        {friends.length === 0 ? (
          <p style={{ color: t.textMuted, fontSize: 14 }}>No friends yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {friends.map((row) => {
              const oid = otherParticipantId(row, myId);
              const un = friendNames[oid];
              const label = un ? `@${un}` : "Collector";
              const href = un ? `/user/${encodeURIComponent(un)}` : undefined;
              const inner = (
                <>
                  <span style={{ fontWeight: 700 }}>{label}</span>
                  <span style={{ color: t.textMuted, fontSize: 13 }}>
                    {un ? "View collection →" : "…"}
                  </span>
                </>
              );
              return href ? (
                <Link
                  key={row.id}
                  href={href}
                  style={{
                    ...dvListCard,
                    textDecoration: "none",
                    color: t.textPrimary,
                    cursor: "pointer",
                  }}
                >
                  {inner}
                </Link>
              ) : (
                <div key={row.id} style={{ ...dvListCard, opacity: 0.85 }}>
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
