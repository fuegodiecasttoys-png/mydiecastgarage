"use client";

import { useCallback, useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { FullPageLoading } from "../components/FullPageLoading";
import { AccentBadge } from "../ui/AccentBadge";
import { IconCircle } from "../ui/IconCircle";
import { dvBodyFont, dvDisplayFont, dvGhostButton } from "../ui/dv-visual";
import { ExperimentFeaturedGarageCard } from "./ExperimentFeaturedGarageCard";
import { ExperimentFavoritesGarageCard } from "./ExperimentFavoritesGarageCard";
import { ExperimentMenuCard } from "./ExperimentMenuCard";
import {
  experimentAppBackground,
  experimentContentMax,
  experimentFeatureBottomMargin,
  experimentHeroBadge,
  experimentHeroBadgeMuted,
  experimentIconPrimary,
  experimentListGap,
  experimentLogoHalo,
  experimentOrange,
  experimentPagePaddingX,
  experimentPagePaddingY,
  experimentQuickIconWrap,
  experimentQuickTileBackground,
  experimentQuickTileBorder,
  experimentQuickTileShadowHover,
  experimentQuickTileShadowRest,
  experimentRadiusMenu,
  experimentTextMuted,
  experimentTextStrong,
} from "./experimentHeroStyle";
import {
  ExpIconCamera,
  ExpIconCar,
  ExpIconHeart,
  ExpIconPackage,
  ExpIconStarFilled,
  ExpIconUsers,
} from "./experimentIcons";

function garageCountLabel(count: number) {
  if (count === 0) return "No models yet";
  if (count === 1) return "1 model";
  return `${count} models`;
}

const pageShell: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
  position: "relative" as const,
  padding: `${experimentPagePaddingY}px ${experimentPagePaddingX}px 32px`,
  background: undefined,
  color: undefined,
  fontFamily: "inherit",
};

const quickButtonBase: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  width: "100%",
  minHeight: 120,
  padding: "16px 12px 16px",
  gap: 10,
  boxSizing: "border-box" as const,
  borderRadius: experimentRadiusMenu,
  cursor: "pointer",
  textAlign: "center" as const,
  color: experimentTextStrong,
  fontFamily: "inherit",
  margin: 0,
  WebkitTapHighlightColor: "transparent",
  border: experimentQuickTileBorder,
  background: experimentQuickTileBackground,
  boxShadow: experimentQuickTileShadowRest,
};

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

  const garageLead: ReactNode = garageCountError ? (
    <span style={experimentHeroBadgeMuted}>Count unavailable</span>
  ) : (
    <span style={experimentHeroBadge}>
      {garageCount > 0 ? (
        <span style={{ display: "inline-flex", lineHeight: 0, marginRight: 2 }} aria-hidden>
          <ExpIconPackage size={12} color="#FFB85C" />
        </span>
      ) : null}
      {garageCountLabel(garageCount)}
    </span>
  );

  return (
    <div
      style={{
        ...pageShell,
        background: experimentAppBackground,
        color: experimentTextStrong,
        fontFamily: dvBodyFont,
      }}
    >
      <div style={experimentContentMax}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: experimentPagePaddingY,
            right: experimentPagePaddingX,
            zIndex: 4,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: experimentTextStrong,
            background: "rgba(8, 12, 20, 0.72)",
            border: "1px solid rgba(255, 159, 10, 0.35)",
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
            stroke={experimentOrange}
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

        <div style={{ textAlign: "center", paddingTop: 2, marginBottom: 20 }}>
          <div style={experimentLogoHalo}>
            <img
              src="/logo.png"
              alt="My Diecast Garage"
              style={{ width: 120, height: "auto", display: "block", margin: "0 auto" }}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                fontFamily: dvDisplayFont,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              My diecast
            </div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.14em",
              }}
            >
              <div
                style={{
                  height: 1,
                  width: 32,
                  background: "linear-gradient(90deg, transparent, rgba(255,159,10,0.65))",
                }}
                aria-hidden
              />
              <span style={{ color: experimentOrange, letterSpacing: "0.2em" }}>GARAGE</span>
              <div
                style={{
                  height: 1,
                  width: 32,
                  background: "linear-gradient(270deg, transparent, rgba(255,159,10,0.65))",
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: experimentListGap,
            marginBottom: 18,
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
            style={{ ...quickButtonBase, boxShadow: experimentQuickTileShadowRest }}
          >
            <div style={experimentQuickIconWrap}>
              <IconCircle variant="orangeQuick">
                <ExpIconPackage color={experimentIconPrimary} size={24} />
              </IconCircle>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                Add Packed
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: experimentTextMuted, lineHeight: 1.4 }}>Boxed models</div>
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
            style={{ ...quickButtonBase, boxShadow: experimentQuickTileShadowRest }}
          >
            <div style={experimentQuickIconWrap}>
              <IconCircle variant="orangeQuick">
                <ExpIconCar color={experimentIconPrimary} size={24} />
              </IconCircle>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                Add Loose
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: experimentTextMuted, lineHeight: 1.4 }}>Loose models</div>
            </div>
          </button>
        </div>

        {garageCountError ? (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,100,100,0.3)",
              background: "rgba(200, 60, 60, 0.12)",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 14,
                fontWeight: 700,
                color: "rgba(255,210,210,0.95)",
                lineHeight: 1.4,
              }}
            >
              Couldn&apos;t load your garage count.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.45, color: experimentTextMuted }}>{garageCountError}</p>
            <button
              type="button"
              disabled={garageCountRetrying || !userId}
              onClick={() => {
                if (userId) void fetchGarageCount(userId);
              }}
              style={{ ...dvGhostButton, fontSize: 13, borderRadius: 999 }}
            >
              {garageCountRetrying ? "Retrying…" : "Retry"}
            </button>
          </div>
        ) : null}

        <div style={{ marginBottom: experimentFeatureBottomMargin }}>
          <ExperimentFeaturedGarageCard
            onClick={() => router.push("/mygarage")}
            title="My Garage"
            lead={garageLead}
            subline={garageCountError ? "You can still open your collection below." : "View your collection"}
            displayFont={dvDisplayFont}
          />
        </div>

        <ExperimentFavoritesGarageCard
          onClick={() => router.push("/favorites")}
          icon={<ExpIconStarFilled color={experimentIconPrimary} size={24} />}
          title="Favorites"
          subtitle="Your top picks"
          marginBottom={experimentListGap}
        />
        <ExperimentMenuCard
          onClick={() => router.push("/wishlist")}
          icon={<ExpIconHeart color={experimentIconPrimary} size={24} />}
          title="Wishlist"
          subtitle="Models you want next"
          marginBottom={experimentListGap}
        />
        <ExperimentMenuCard
          onClick={() => router.push("/friends")}
          icon={<ExpIconUsers color={experimentIconPrimary} size={24} />}
          title={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span>Add Friends</span>
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
            </span>
          }
          subtitle="View each other's garages (view only)"
          marginBottom={experimentListGap}
        />
        <ExperimentMenuCard
          onClick={() => router.push("/howto")}
          icon={<ExpIconCamera color={experimentIconPrimary} size={24} />}
          title="How To"
          subtitle="Tips for great photos"
          marginBottom={0}
        />
      </div>
    </div>
  );
}
