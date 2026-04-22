"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { FullPageLoading } from "../components/FullPageLoading";
import { AccentBadge } from "../ui/AccentBadge";
import { IconCircle } from "../ui/IconCircle";
import { t } from "../ui/dv-tokens";
import {
  dvDashboardInner,
  dvDisplayFont,
  dvGhostButton,
  dvHeroRowCard,
  dvPageShell,
  dvQuickTile,
  dvRowCardBase,
} from "../ui/dv-visual";
import {
  experimentHeroBackground,
  experimentHeroBadge,
  experimentHeroBorder,
  experimentHeroBoxShadow,
  experimentHeroBoxShadowHover,
  experimentHeroChevron,
  experimentHeroIconBorder,
  experimentHeroIconBoxShadow,
  experimentListChevron,
  experimentListRowOrangeAccent,
  experimentListRowShadowHoverWarm,
  experimentListRowShadowHoverWish,
  experimentListRowShadowRestWarm,
  experimentListRowShadowRestWish,
  experimentListRowWishlist,
  experimentListTitle,
  experimentLogoHalo,
  experimentQuickEmojiStyle,
  experimentQuickTileBackground,
  experimentQuickTileBorder,
  experimentQuickTileShadowHover,
  experimentQuickTileShadowRest,
} from "./experimentHeroStyle";

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

/**
 * /experiment: same dashboard behavior as `app/page` with experiment-only
 * “My Garage” hero styling (see `experimentHeroStyle.ts`). Production `/` is unchanged.
 */
function ExperimentHeroIcon() {
  return (
    <div
      aria-hidden
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        background: "rgba(255,255,255,0.04)",
        border: experimentHeroIconBorder,
        boxShadow: experimentHeroIconBoxShadow,
        fontSize: 22,
      }}
    >
      🏠
    </div>
  );
}

export default function ExperimentPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [garageCount, setGarageCount] = useState(0);
  const [garageCountError, setGarageCountError] = useState<string | null>(null);
  const [garageCountRetrying, setGarageCountRetrying] = useState(false);
  const [pendingFriendRequestsCount, setPendingFriendRequestsCount] = useState(0);

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
      await Promise.all([fetchGarageCount(data.user.id), fetchPendingFriendRequests(data.user.id)]);
      setCheckingAuth(false);
    }

    void checkUser();
  }, [router, fetchGarageCount, fetchPendingFriendRequests]);

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

        {/* Branding */}
        <div style={{ textAlign: "center", paddingTop: 4, marginBottom: 22 }}>
          <div style={experimentLogoHalo}>
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

        {/* Add Packed / Add Loose */}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = experimentQuickTileShadowHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = experimentQuickTileShadowRest;
            }}
            style={{
              ...dvQuickTile,
              flexDirection: "column",
              alignItems: "stretch",
              padding: "16px 12px 14px",
              gap: 10,
              minHeight: 118,
              background: experimentQuickTileBackground,
              border: experimentQuickTileBorder,
              boxShadow: experimentQuickTileShadowRest,
            }}
          >
            <div style={experimentQuickEmojiStyle}>
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
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = experimentQuickTileShadowHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = experimentQuickTileShadowRest;
            }}
            style={{
              ...dvQuickTile,
              flexDirection: "column",
              alignItems: "stretch",
              padding: "16px 12px 14px",
              gap: 10,
              minHeight: 118,
              background: experimentQuickTileBackground,
              border: experimentQuickTileBorder,
              boxShadow: experimentQuickTileShadowRest,
            }}
          >
            <div style={experimentQuickEmojiStyle}>
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
            <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "rgba(255,200,200,0.92)", lineHeight: 1.4 }}>
              Couldn&apos;t load your garage count.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 12, lineHeight: 1.45, color: t.textMuted }}>{garageCountError}</p>
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

        {/* My Garage — primary (experiment: premium material hero, see experimentHeroStyle) */}
        <button
          type="button"
          onClick={() => router.push("/mygarage")}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = experimentHeroBoxShadowHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = experimentHeroBoxShadow;
          }}
          style={{
            ...dvHeroRowCard,
            marginBottom: 12,
            minHeight: 120,
            background: experimentHeroBackground,
            border: experimentHeroBorder,
            boxShadow: experimentHeroBoxShadow,
          }}
        >
          <ExperimentHeroIcon />
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
              <AccentBadge style={garageCountError ? undefined : experimentHeroBadge}>
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
              {garageCountError ? "You can still open your collection below." : "View your collection"}
            </div>
          </div>
          <span style={{ ...chevronStyle, color: experimentHeroChevron }} aria-hidden>
            ›
          </span>
        </button>

        {/* Favorites — same row pattern as Wishlist */}
        <button
          type="button"
          onClick={() => router.push("/favorites")}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowHoverWarm;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowRestWarm;
          }}
          style={{ ...rowCardBase, marginBottom: 12, ...experimentListRowOrangeAccent }}
        >
          <div
            style={{
              lineHeight: 0,
              borderRadius: 14,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 0 10px rgba(255,122,24,0.05)",
            }}
          >
            <IconCircle variant="orangeSubtle">⭐</IconCircle>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
                color: experimentListTitle,
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
          <span style={{ ...chevronStyle, color: experimentListChevron }} aria-hidden>
            ›
          </span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => router.push("/wishlist")}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowHoverWish;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowRestWish;
          }}
          style={{ ...rowCardBase, marginBottom: 12, ...experimentListRowWishlist }}
        >
          <div
            style={{
              lineHeight: 0,
              borderRadius: 14,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.12)",
            }}
          >
            <IconCircle variant="neutral">⭐</IconCircle>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
                color: experimentListTitle,
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
          <span style={{ ...chevronStyle, color: experimentListChevron }} aria-hidden>
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/friends")}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowHoverWarm;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowRestWarm;
          }}
          style={{ ...rowCardBase, marginBottom: 12, ...experimentListRowOrangeAccent }}
        >
          <div
            style={{
              lineHeight: 0,
              borderRadius: 14,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 0 10px rgba(255,122,24,0.05)",
            }}
          >
            <IconCircle variant="orangeSubtle">👥</IconCircle>
          </div>
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
                  color: experimentListTitle,
                }}
              >
                Add Friends
              </span>
              {pendingFriendRequestsCount > 0 ? (
                <AccentBadge
                  aria-label={`${pendingFriendRequestsCount} pending friend request${pendingFriendRequestsCount === 1 ? "" : "s"}`}
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
          <span style={{ ...chevronStyle, color: experimentListChevron }} aria-hidden>
            ›
          </span>
        </button>

        {/* How To */}
        <button
          type="button"
          onClick={() => router.push("/howto")}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowHoverWarm;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowRestWarm;
          }}
          style={{ ...rowCardBase, marginBottom: 0, ...experimentListRowOrangeAccent }}
        >
          <div
            style={{
              lineHeight: 0,
              borderRadius: 14,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 0 10px rgba(255,122,24,0.05)",
            }}
          >
            <IconCircle variant="orangeSubtle">📖</IconCircle>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
                color: experimentListTitle,
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
          <span style={{ ...chevronStyle, color: experimentListChevron }} aria-hidden>
            ›
          </span>
        </button>
      </div>
    </div>
  );
}
