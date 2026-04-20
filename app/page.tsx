"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { FullPageLoading } from "./components/FullPageLoading";
import { AccentBadge } from "./ui/AccentBadge";
import { IconCircle } from "./ui/IconCircle";
import { t } from "./ui/dv-tokens";
import {
  dvDisplayFont,
  dvGhostButton,
  dvHeroRowCard,
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
  const [garageCount, setGarageCount] = useState(0);

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

      const { count, error } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", data.user.id);

      if (!error && count !== null) {
        setGarageCount(count);
      } else {
        setGarageCount(0);
      }

      setCheckingAuth(false);
    }

    void checkUser();
  }, [router]);

  if (checkingAuth) {
    return <FullPageLoading label="Loading your garage..." />;
  }

  return (
    <div style={dvPageShell}>
      <div
        style={{
          position: "relative",
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
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
        <div style={{ textAlign: "center", paddingTop: 4, marginBottom: 26 }}>
          <div
            style={{
              marginBottom: 14,
              filter: "drop-shadow(0 0 14px rgba(255,106,0,0.12))",
            }}
          >
            <img
              src="/logo.png"
              alt="My Diecast Garage"
              style={{
                width: 88,
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: dvDisplayFont,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              lineHeight: 1.45,
              color: t.textSecondary,
            }}
          >
            <span aria-hidden style={{ opacity: 0.4, letterSpacing: "0.08em" }}>
              —
            </span>{" "}
            MY DIECAST GARAGE{" "}
            <span aria-hidden style={{ opacity: 0.4, letterSpacing: "0.08em" }}>
              —
            </span>
          </h1>
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

        {/* My Garage — primary */}
        <button
          type="button"
          onClick={() => router.push("/mygarage")}
          style={{
            ...dvHeroRowCard,
            marginBottom: 12,
            minHeight: 120,
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
                {garageCount > 0 ? (
                  <span style={{ fontSize: 11, opacity: 0.95 }} aria-hidden>
                    📦
                  </span>
                ) : null}
                {garageCountLabel(garageCount)}
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
              View your collection
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.orange400 }} aria-hidden>
            ›
          </span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => router.push("/wishlist")}
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

        {/* Add Friends — coming soon */}
        <div
          role="group"
          aria-label="Add friends, coming soon"
          style={{
            ...rowCardBase,
            marginBottom: 12,
            opacity: 0.62,
            cursor: "default",
            pointerEvents: "none",
          }}
        >
          <IconCircle variant="muted">👥</IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
                color: t.textSecondary,
              }}
            >
              Add Friends
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Connect with collectors
            </div>
          </div>
          <AccentBadge muted style={{ flexShrink: 0 }}>
            Coming soon
          </AccentBadge>
        </div>

        {/* How To */}
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
