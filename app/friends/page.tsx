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
import {
  isValidUsernameFormat,
  normalizeUsernameInput,
  publicProfileLabel,
} from "../lib/profileUsername";
import { t } from "../ui/dv-tokens";
import {
  dvAppPageShell,
  dvDashboardInner,
  dvGhostButton,
  dvListCard,
  dvModelListCardHoverHandlers,
  dvInput,
  dvPrimaryButton,
  dvDisplayFont,
} from "../ui/dv-visual";
import { FullPageLoading } from "../components/FullPageLoading";

type PeerProfile = { user_id: string; username: string | null; name: string | null };

export default function FriendsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [meProfile, setMeProfile] = useState<{ username: string | null; name: string | null }>({
    username: null,
    name: null,
  });

  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [incoming, setIncoming] = useState<FriendRequestRow[]>([]);
  const [incomingPeers, setIncomingPeers] = useState<Record<string, PeerProfile>>({});

  const [outgoing, setOutgoing] = useState<FriendRequestRow[]>([]);
  const [outgoingPeers, setOutgoingPeers] = useState<Record<string, PeerProfile>>({});

  const [friends, setFriends] = useState<FriendRequestRow[]>([]);
  const [friendPeers, setFriendPeers] = useState<Record<string, PeerProfile>>({});

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
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, username, name")
        .in("user_id", sids);
      const map: Record<string, PeerProfile> = {};
      (profs as PeerProfile[] | null)?.forEach((p) => {
        map[p.user_id] = p;
      });
      setIncomingPeers(map);
    } else {
      setIncomingPeers({});
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
      const { data: profs2 } = await supabase
        .from("profiles")
        .select("user_id, username, name")
        .in("user_id", rids);
      const map2: Record<string, PeerProfile> = {};
      (profs2 as PeerProfile[] | null)?.forEach((p) => {
        map2[p.user_id] = p;
      });
      setOutgoingPeers(map2);
    } else {
      setOutgoingPeers({});
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
      const { data: profs3 } = await supabase
        .from("profiles")
        .select("user_id, username, name")
        .in("user_id", otherIds);
      const map3: Record<string, PeerProfile> = {};
      (profs3 as PeerProfile[] | null)?.forEach((p) => {
        map3[p.user_id] = p;
      });
      setFriendPeers(map3);
    } else {
      setFriendPeers({});
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
        .select("username, name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) {
        setMeProfile({
          username: (meProf?.username as string | null) ?? null,
          name: (meProf as { name?: string | null } | null)?.name ?? null,
        });
      }

      await loadAll(user.id);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, loadAll]);

  async function handleSendRequest() {
    setMessage(null);
    const clean = normalizeUsernameInput(search);
    if (!clean) {
      setMessage("Enter a username.");
      return;
    }
    if (!isValidUsernameFormat(clean)) {
      setMessage("Username unavailable");
      return;
    }

    setBusy(true);
    try {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        setMessage("You must be signed in to send a request.");
        return;
      }

      const senderId = currentUser.id;

      const { data: senderRow, error: senderProfError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", senderId)
        .maybeSingle();
      if (senderProfError || !senderRow?.user_id) {
        setMessage(
          "Your profile is not set up yet (missing profiles row). Finish signup or create your profile before adding friends."
        );
        return;
      }

      const foundUser = await fetchProfileByUsername(supabase, clean);
      if (!foundUser) {
        setMessage("No user with that username.");
        return;
      }

      const receiverId = foundUser.user_id;
      if (receiverId === senderId) {
        setMessage("You cannot add yourself.");
        return;
      }

      const { data: receiverRow, error: receiverProfError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", receiverId)
        .maybeSingle();
      if (receiverProfError || !receiverRow?.user_id) {
        setMessage("That user does not have a profile and cannot receive requests.");
        return;
      }

      if (await areFriends(supabase, senderId, receiverId)) {
        setMessage("You are already friends with this user.");
        return;
      }

      const { data: pend1 } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("status", "pending")
        .eq("sender_id", senderId)
        .eq("receiver_id", receiverId)
        .maybeSingle();
      if (pend1) {
        setMessage("A request is already pending to this user.");
        return;
      }

      const { data: pend2 } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("status", "pending")
        .eq("sender_id", receiverId)
        .eq("receiver_id", senderId)
        .maybeSingle();
      if (pend2) {
        setMessage("This user already sent you a request — check Incoming.");
        return;
      }

      console.log("[friend_requests] insert", {
        sender_id: senderId,
        receiver_id: receiverId,
      });

      const { error } = await supabase.from("friend_requests").insert({
        sender_id: senderId,
        receiver_id: receiverId,
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
      await loadAll(senderId);
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

  const meLabel = publicProfileLabel(meProfile);

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
    <div style={dvAppPageShell}>
      <Link href="/" style={{ ...dvGhostButton, textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
        ← Home
      </Link>

      <div style={dvDashboardInner}>
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
        <div style={{ margin: "0 0 20px" }}>
          <p style={{ margin: "0 0 4px", color: t.textMuted, fontSize: 13 }}>
            Your public handle:{" "}
            <strong style={{ color: meLabel.handle ? t.orange300 : t.textSecondary }}>{meLabel.primary}</strong>
          </p>
          {meLabel.secondary ? (
            <p style={{ margin: 0, color: t.textMuted, fontSize: 12 }}>{meLabel.secondary}</p>
          ) : null}
        </div>

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
            {incoming.map((row) => {
              const peer = incomingPeers[row.sender_id];
              const label = publicProfileLabel({
                username: peer?.username ?? null,
                name: peer?.name ?? null,
              });
              return (
                <div
                  key={row.id}
                  {...dvModelListCardHoverHandlers}
                  style={{ ...dvListCard, flexDirection: "column", alignItems: "stretch" }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: t.textPrimary }}>{label.primary}</div>
                    {label.secondary ? (
                      <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{label.secondary}</div>
                    ) : null}
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
              );
            })}
          </div>
        )}

        {sectionTitle("Sent requests")}
        {outgoing.filter((r) => r.status === "pending").length === 0 ? (
          <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>No outgoing pending.</p>
        ) : (
          <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
            {outgoing
              .filter((r) => r.status === "pending")
              .map((row) => {
                const peer = outgoingPeers[row.receiver_id];
                const label = publicProfileLabel({
                  username: peer?.username ?? null,
                  name: peer?.name ?? null,
                });
                return (
                  <div
                    key={row.id}
                    {...dvModelListCardHoverHandlers}
                    style={{ ...dvListCard, justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: t.textPrimary, fontWeight: 600 }}>{label.primary}</div>
                      {label.secondary ? (
                        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{label.secondary}</div>
                      ) : null}
                    </div>
                    <span style={{ color: t.orange300, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>Pending</span>
                  </div>
                );
              })}
          </div>
        )}

        {sectionTitle("Friends")}
        {friends.length === 0 ? (
          <p style={{ color: t.textMuted, fontSize: 14 }}>No friends yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {friends.map((row) => {
              const oid = otherParticipantId(row, myId);
              const peer = friendPeers[oid];
              const label = publicProfileLabel({
                username: peer?.username ?? null,
                name: peer?.name ?? null,
              });
              const href = label.handle ? `/user/${encodeURIComponent(label.handle)}` : undefined;
              const inner = (
                <>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 700 }}>{label.primary}</span>
                    {label.secondary ? (
                      <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{label.secondary}</div>
                    ) : null}
                  </div>
                  <span style={{ color: t.textMuted, fontSize: 13, flexShrink: 0 }}>
                    {href ? "View collection →" : "—"}
                  </span>
                </>
              );
              return href ? (
                <Link
                  key={row.id}
                  href={href}
                  {...dvModelListCardHoverHandlers}
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
                <div key={row.id} {...dvModelListCardHoverHandlers} style={{ ...dvListCard, opacity: 0.85 }}>
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
