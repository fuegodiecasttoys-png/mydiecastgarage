"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile, isActiveProRow } from "./lib/fetchProfile";
import { supabase } from "./lib/supabaseClient";
import { FullPageLoading } from "./components/FullPageLoading";
import { AccentBadge } from "./ui/AccentBadge";
import { IconCircle } from "./ui/IconCircle";
import { t } from "./ui/dv-tokens";
import {
  dvCardOrangeBorder,
  dvDashboardInner,
  dvDisplayFont,
  dvGhostButton,
  dvHeroRowCard,
  dvModelHeroRowCardHoverHandlers,
  dvModelQuickTileHoverHandlers,
  dvModelRowCardHoverHandlers,
  dvPageShell,
  dvQuickTile,
  dvRowCardBase,
} from "./ui/dv-visual";

function garageCountLabel(count: number) {
  if (count === 0) return "No models yet";
  if (count === 1) return "1 model";
  return `${count} models`;
}

const chevronStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 300,
  opacity: 0.85,
  marginLeft: 8,
  flexShrink: 0,
};

const rowCardBase = dvRowCardBase;

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [garageCount, setGarageCount] = useState(0);
  const [garageCountError, setGarageCountError] = useState<string | null>(null);
  const [garageCountRetrying, setGarageCountRetrying] = useState(false);
  const [pendingFriendRequestsCount, setPendingFriendRequestsCount] = useState(0);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const row = await fetchProfile(
      user.id,
      "plan, is_active, monthly_captures, monthly_ai_scans"
    );
    if (row) setProfile(row);
  }, []);

  const fetchPendingFriendRequests = useCallback(async (uid: string) => {
    const { count, error } = await supabase
      .from("friend_requests")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", uid)
      .eq("status", "pending");

    if (error || count === null) {
      setPendingFriendRequestsCount(0);
      return;
    }

    setPendingFriendRequestsCount(count);
  }, []);

  const fetchGarageCount = useCallback(async (uid: string) => {
    setGarageCountRetrying(true);
    setGarageCountError(null);

    const { count, error } = await supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uid);

    setGarageCountRetrying(false);

    if (error) {
      setGarageCountError(error.message || "Could not load your collection.");
      return;
    }

    if (count === null) {
      setGarageCountError("Could not load your collection.");
      return;
    }

    setGarageCount(count);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Error logging out");
      return;
    }

    router.replace("/login");
  };

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);

      await loadProfile();

      await Promise.all([
        fetchGarageCount(data.user.id),
        fetchPendingFriendRequests(data.user.id),
      ]);

      setCheckingAuth(false);
    }

    void checkUser();
  }, [router, fetchGarageCount, fetchPendingFriendRequests, loadProfile]);

  useEffect(() => {
    const handleFocus = () => {
      void loadProfile();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadProfile]);

  if (checkingAuth) {
    return <FullPageLoading label="Loading your garage..." />;
  }

  return (
    <div style={dvPageShell}>
      <div style={dvDashboardInner}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            ...dvGhostButton,
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 2,
            fontSize: 12,
            letterSpacing: "0.02em",
          }}
        >
          Logout
        </button>

        <div style={{ textAlign: "center", paddingTop: 4, marginBottom: 22 }}>
          <div
            style={{
              filter: "drop-shadow(0 0 10px rgba(255,122,24,0.08))",
            }}
          >
            <img
              src="/logo.png"
              alt="My Diecast Garage"
              style={{
                width: 120,
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/capture-packed")}
            {...dvModelQuickTileHoverHandlers}
            style={{
              ...dvQuickTile,
              flexDirection: "column",
              alignItems: "stretch",
              padding: "16px 12px 14px",
              gap: 10,
              minHeight: 118,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconCircle variant="orangeQuick">📦</IconCircle>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                }}
              >
                Add Packed
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: t.textMuted,
                  lineHeight: 1.35,
                }}
              >
                Boxed models
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/capture-loose")}
            {...dvModelQuickTileHoverHandlers}
            style={{
              ...dvQuickTile,
              flexDirection: "column",
              alignItems: "stretch",
              padding: "16px 12px 14px",
              gap: 10,
              minHeight: 118,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconCircle variant="orangeQuick">🚗</IconCircle>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                }}
              >
                Add Loose
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: t.textMuted,
                  lineHeight: 1.35,
                }}
              >
                Loose models
              </div>
            </div>
          </button>
        </div>

        {!isActiveProRow(profile) ? (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255, 122, 24, 0.08)",
              border: "1px solid rgba(255, 122, 24, 0.25)",
              color: t.textSecondary,
              fontSize: 13,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {((profile?.monthly_captures as number | undefined) || 0)} / 30 captures used
          </div>
        ) : null}

        {garageCountError ? (
          <div
            style={{
              marginBottom: 12,
              padding: "12px 14px",
              borderRadius: t.radiusMd,
              border: "1px solid rgba(255,100,100,0.28)",
              background: "rgba(200, 60, 60, 0.1)",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(255,200,200,0.92)",
                lineHeight: 1.4,
              }}
            >
              Couldn&apos;t load your garage count.
            </p>

            <p
              style={{
                margin: "0 0 12px",
                fontSize: 12,
                lineHeight: 1.45,
                color: t.textMuted,
              }}
            >
              {garageCountError}
            </p>

            <button
              type="button"
              disabled={garageCountRetrying || !userId}
              onClick={() => {
                if (userId) void fetchGarageCount(userId);
              }}
              style={{ ...dvGhostButton, fontSize: 13 }}
            >
              {garageCountRetrying ? "Retrying…" : "Retry"}
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => router.push("/account")}
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 12 }}
        >
          <IconCircle variant="orangeSubtle">👤</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              My Account
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Plan, usage, and subscription
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/mygarage")}
          {...dvModelHeroRowCardHoverHandlers}
          style={{
            ...dvHeroRowCard,
            marginBottom: 12,
            minHeight: 120,
            border: `2px solid ${dvCardOrangeBorder}`,
          }}
        >
          <IconCircle variant="accent">🏠</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: dvDisplayFont,
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              My Garage
            </div>
            <div style={{ marginBottom: 8 }}>
              <AccentBadge>
                {garageCountError ? null : garageCount > 0 ? (
                  <span style={{ fontSize: 11, opacity: 0.95 }} aria-hidden>
                    📦
                  </span>
                ) : null}
                {garageCountError ? "Count unavailable" : garageCountLabel(garageCount)}
              </AccentBadge>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: t.textSecondary,
                lineHeight: 1.35,
              }}
            >
              {garageCountError
                ? "You can still open your collection below."
                : "View your collection"}
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.orange400 }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/favorites")}
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 12 }}
        >
          <IconCircle variant="orangeSubtle">⭐</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Favorites
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Your top picks
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/wishlist")}
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 12 }}
        >
          <IconCircle variant="neutral">⭐</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Wishlist
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Models you want next
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/friends")}
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 12 }}
        >
          <IconCircle variant="orangeSubtle">👥</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Add Friends
              </span>
              {pendingFriendRequestsCount > 0 ? (
                <AccentBadge
                  aria-label={`${pendingFriendRequestsCount} pending friend request${
                    pendingFriendRequestsCount === 1 ? "" : "s"
                  }`}
                  style={{
                    padding: "2px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    minWidth: 24,
                    justifyContent: "center",
                  }}
                >
                  {pendingFriendRequestsCount > 99 ? "99+" : pendingFriendRequestsCount}
                </AccentBadge>
              ) : null}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              View each other&apos;s garages (view only)
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/pro")}
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginTop: 12, marginBottom: 12 }}
        >
          <IconCircle variant="orangeSubtle">🚀</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Upgrade to Pro
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Unlock unlimited features
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/pro?scanPack=1")}
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 0 }}
        >
          <IconCircle variant="orangeSubtle">⚡</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Buy More Scans
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Get 50 model scans for $0.99
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/howto")}
          style={{ ...rowCardBase, marginBottom: 0 }}
        >
          <IconCircle variant="orangeSubtle">📖</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              How To
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Tips for great photos
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </button>
      </div>
    </div>
  );
}