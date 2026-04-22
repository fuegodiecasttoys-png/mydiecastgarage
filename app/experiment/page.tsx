"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { FullPageLoading } from "../components/FullPageLoading";
import { AccentBadge } from "../ui/AccentBadge";
import { IconCircle } from "../ui/IconCircle";
import { t } from "../ui/dv-tokens";
import {
  dvBodyFont,
  dvDashboardInner,
  dvDisplayFont,
  dvGhostButton,
  dvHeroRowCard,
  dvPageShell,
  dvQuickTile,
  dvRowCardBase,
} from "../ui/dv-visual";
import {
  experimentAppBackground,
  experimentHeroBackground,
  experimentHeroBadge,
  experimentHeroBorder,
  experimentOrange,
  experimentHeroBoxShadow,
  experimentHeroBoxShadowHover,
  experimentHeroChevron,
  experimentHeroIconBorder,
  experimentHeroIconBoxShadow,
  experimentIconPrimary,
  experimentListChevron,
  experimentListIconFrame,
  experimentListRowOrangeAccent,
  experimentListRowShadowHoverWarm,
  experimentListRowShadowRestWarm,
  experimentListTitle,
  experimentLogoHalo,
  experimentQuickIconWrap,
  experimentQuickTileBackground,
  experimentQuickTileBorder,
  experimentQuickTileShadowHover,
  experimentQuickTileShadowRest,
  experimentTextMuted,
  experimentTextStrong,
} from "./experimentHeroStyle";
import { ExperimentHeroCarDeco } from "./ExperimentHeroCarDeco";
import {
  ExpIconCamera,
  ExpIconCar,
  ExpIconHeart,
  ExpIconHouse,
  ExpIconPackage,
  ExpIconStar,
  ExpIconUsers,
} from "./experimentIcons";

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
        position: "relative",
        zIndex: 2,
        background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(12,16,24,0.4) 100%)",
        border: experimentHeroIconBorder,
        boxShadow: experimentHeroIconBoxShadow,
        lineHeight: 0,
      }}
    >
      <ExpIconHouse color={experimentIconPrimary} size={24} />
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
    <div
      style={{
        ...dvPageShell,
        background: experimentAppBackground,
        color: experimentTextStrong,
        fontFamily: dvBodyFont,
        padding: "20px 18px 32px",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div style={dvDashboardInner}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: experimentTextStrong,
            background: "rgba(8, 12, 20, 0.65)",
            border: "1px solid rgba(255, 154, 31, 0.38)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
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
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                fontFamily: dvDisplayFont,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: experimentTextStrong,
                textTransform: "uppercase",
              }}
            >
              My diecast
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.42)",
              }}
            >
              <span>—</span>
              <span
                style={{
                  color: experimentOrange,
                  letterSpacing: "0.22em",
                }}
              >
                GARAGE
              </span>
              <span>—</span>
            </div>
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
            <div style={experimentQuickIconWrap}>
              <IconCircle variant="orangeQuick">
                <ExpIconPackage color={experimentIconPrimary} size={24} />
              </IconCircle>
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
                color: experimentTextMuted,
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
            <div style={experimentQuickIconWrap}>
              <IconCircle variant="orangeQuick">
                <ExpIconCar color={experimentIconPrimary} size={24} />
              </IconCircle>
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
                color: experimentTextMuted,
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
            <p style={{ margin: "0 0 12px", fontSize: 12, lineHeight: 1.45, color: experimentTextMuted }}>{garageCountError}</p>
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
            position: "relative",
            overflow: "hidden",
            marginBottom: 12,
            minHeight: 120,
            background: experimentHeroBackground,
            border: experimentHeroBorder,
            boxShadow: experimentHeroBoxShadow,
            alignItems: "center",
          }}
        >
          <ExperimentHeroCarDeco />
          <ExperimentHeroIcon />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontFamily: dvDisplayFont,
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 8,
                color: experimentTextStrong,
              }}
            >
              My Garage
            </div>
            <div style={{ marginBottom: 8 }}>
              <AccentBadge style={garageCountError ? undefined : experimentHeroBadge}>
                {garageCountError ? null : garageCount > 0 ? (
                  <span style={{ display: "inline-flex", lineHeight: 0, marginRight: 4 }} aria-hidden>
                    <ExpIconPackage size={12} color={experimentHeroBadge.color} />
                  </span>
                ) : null}
                {garageCountError ? "Count unavailable" : garageCountLabel(garageCount)}
              </AccentBadge>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: experimentTextMuted,
                lineHeight: 1.35,
              }}
            >
              {garageCountError ? "You can still open your collection below." : "View your collection"}
            </div>
          </div>
          <span
            style={{
              ...chevronStyle,
              color: experimentHeroChevron,
              position: "relative",
              zIndex: 3,
            }}
            aria-hidden
          >
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
          <div style={experimentListIconFrame}>
            <IconCircle variant="orangeSubtle">
              <ExpIconStar color={experimentIconPrimary} size={24} />
            </IconCircle>
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
                color: experimentTextMuted,
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
            e.currentTarget.style.boxShadow = experimentListRowShadowHoverWarm;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = experimentListRowShadowRestWarm;
          }}
          style={{ ...rowCardBase, marginBottom: 12, ...experimentListRowOrangeAccent }}
        >
          <div style={experimentListIconFrame}>
            <IconCircle variant="orangeSubtle">
              <ExpIconHeart color={experimentIconPrimary} size={24} />
            </IconCircle>
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
                color: experimentTextMuted,
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
          <div style={experimentListIconFrame}>
            <IconCircle variant="orangeSubtle">
              <ExpIconUsers color={experimentIconPrimary} size={24} />
            </IconCircle>
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
                color: experimentTextMuted,
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
          <div style={experimentListIconFrame}>
            <IconCircle variant="orangeSubtle">
              <ExpIconCamera color={experimentIconPrimary} size={24} />
            </IconCircle>
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
                color: experimentTextMuted,
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
