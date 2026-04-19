"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Sandbox visual only — mock count for layout evaluation */
const MOCK_PIECE_COUNT = 12;

function pieceLabel(count: number) {
  if (count === 0) return "No pieces yet";
  if (count === 1) return "1 piece";
  return `${count} pieces`;
}

const pageShell: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
  padding: "22px 18px 36px",
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  color: "#f4f4f5",
  background: `
    radial-gradient(ellipse 100% 70% at 100% -10%, rgba(249,115,22,0.14) 0%, transparent 45%),
    radial-gradient(ellipse 80% 55% at 0% 30%, rgba(59,130,246,0.06) 0%, transparent 42%),
    radial-gradient(ellipse 90% 60% at 50% 110%, rgba(0,0,0,0.55) 0%, transparent 50%),
    linear-gradient(175deg, #0a0a0c 0%, #111113 35%, #0d0d10 100%)
  `,
};

const accentLine: CSSProperties = {
  height: 2,
  width: 56,
  margin: "0 auto 18px",
  borderRadius: 2,
  background:
    "linear-gradient(90deg, transparent, rgba(249,115,22,0.85), rgba(251,191,36,0.6), transparent)",
  boxShadow: "0 0 16px rgba(249,115,22,0.35)",
};

function EmberIcon({
  children,
  ring,
}: {
  children: ReactNode;
  ring: "ember" | "steel" | "violet" | "sage" | "flame";
}) {
  const rings = {
    ember: {
      bg: "linear-gradient(145deg, rgba(249,115,22,0.35) 0%, rgba(185,28,28,0.22) 100%)",
      border: "rgba(251,146,60,0.55)",
      glow: "0 0 20px rgba(249,115,22,0.2)",
    },
    steel: {
      bg: "linear-gradient(145deg, rgba(82,82,91,0.55) 0%, rgba(39,39,42,0.85) 100%)",
      border: "rgba(161,161,170,0.35)",
      glow: "0 0 12px rgba(255,255,255,0.06)",
    },
    violet: {
      bg: "linear-gradient(145deg, rgba(139,92,246,0.35) 0%, rgba(76,29,149,0.35) 100%)",
      border: "rgba(196,181,253,0.45)",
      glow: "0 0 18px rgba(139,92,246,0.2)",
    },
    sage: {
      bg: "linear-gradient(145deg, rgba(74,222,128,0.18) 0%, rgba(22,101,52,0.25) 100%)",
      border: "rgba(134,239,172,0.35)",
      glow: "none",
    },
    flame: {
      bg: "linear-gradient(145deg, rgba(251,146,60,0.4) 0%, rgba(234,88,12,0.3) 100%)",
      border: "rgba(253,186,116,0.5)",
      glow: "0 0 18px rgba(251,146,60,0.25)",
    },
  };
  const r = rings[ring];
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        fontSize: 22,
        flexShrink: 0,
        background: r.bg,
        border: `1px solid ${r.border}`,
        boxShadow: `${r.glow}, inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 16px rgba(0,0,0,0.45)`,
      }}
    >
      {children}
    </div>
  );
}

function Tile({
  href,
  title,
  subtitle,
  icon,
  ring,
  hero,
  disabled,
  badge,
  chevron,
}: {
  href?: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  ring: "ember" | "steel" | "violet" | "sage" | "flame";
  hero?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
  chevron?: boolean;
}) {
  const base: CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: hero ? "20px 18px" : "16px 16px",
    borderRadius: 18,
    textAlign: "left",
    border: hero
      ? "1px solid rgba(249,115,22,0.38)"
      : "1px solid rgba(255,255,255,0.07)",
    background: hero
      ? "linear-gradient(165deg, rgba(30,24,20,0.98) 0%, rgba(18,16,14,0.99) 45%, rgba(12,11,10,1) 100%)"
      : "linear-gradient(165deg, rgba(28,28,32,0.96) 0%, rgba(18,18,22,0.99) 100%)",
    boxShadow: hero
      ? "0 14px 40px rgba(0,0,0,0.55), 0 0 48px rgba(249,115,22,0.12), inset 0 1px 0 rgba(255,255,255,0.06)"
      : "0 10px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.52 : 1,
    filter: disabled ? "saturate(0.75)" : "none",
    pointerEvents: disabled ? "none" : "auto",
    transition: "transform 0.15s ease, box-shadow 0.2s ease",
    color: "#fafafa",
  };

  const inner = (
    <>
      <EmberIcon ring={ring}>{icon}</EmberIcon>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: hero ? 18 : 16,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: badge || subtitle ? 6 : 0,
          }}
        >
          {title}
        </div>
        {badge}
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(244,244,245,0.58)",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>
      {chevron && !disabled ? (
        <span
          style={{
            fontSize: 22,
            fontWeight: 200,
            color: hero ? "#fb923c" : "rgba(250,250,250,0.45)",
            flexShrink: 0,
          }}
          aria-hidden
        >
          ›
        </span>
      ) : null}
    </>
  );

  if (disabled || !href) {
    return (
      <div style={{ ...base, marginBottom: 14 }} role="group">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      style={{ ...base, marginBottom: 14, textDecoration: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.01)";
        e.currentTarget.style.boxShadow = hero
          ? "0 18px 48px rgba(0,0,0,0.58), 0 0 56px rgba(249,115,22,0.16), inset 0 1px 0 rgba(255,255,255,0.07)"
          : "0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = base.boxShadow as string;
      }}
    >
      {inner}
    </Link>
  );
}

export default function ExperimentPage() {
  const count = MOCK_PIECE_COUNT;

  const garageBadge = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 11px",
        borderRadius: 999,
        marginBottom: 6,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.03em",
        color: "#fff7ed",
        background:
          "linear-gradient(100deg, rgba(249,115,22,0.45) 0%, rgba(234,88,12,0.5) 40%, rgba(59,130,246,0.25) 100%)",
        border: "1px solid rgba(253,186,116,0.45)",
        boxShadow:
          "0 0 22px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <span aria-hidden style={{ fontSize: 11 }}>
        ◆
      </span>
      <span style={{ fontWeight: 700 }}>{pieceLabel(count)}</span>
    </div>
  );

  return (
    <div style={pageShell}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(250,250,250,0.55)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            ← Home
          </Link>
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "rgba(249,115,22,0.75)",
              textTransform: "uppercase",
            }}
          >
            Lab
          </span>
        </div>

        <div style={accentLine} aria-hidden />

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              marginBottom: 14,
              filter: "drop-shadow(0 0 18px rgba(249,115,22,0.25))",
            }}
          >
            <img
              src="/logo.png"
              alt=""
              style={{ width: 80, height: "auto", display: "block", margin: "0 auto" }}
            />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#e4e4e7",
              textShadow: "0 0 24px rgba(249,115,22,0.15), 0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ opacity: 0.35 }}>—</span> MY DIECAST GARAGE{" "}
            <span style={{ opacity: 0.35 }}>—</span>
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 12,
              color: "rgba(228,228,231,0.5)",
              fontWeight: 500,
            }}
          >
            Racing garage · collector mode
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <Link
            href="/capture-packed"
            style={{
              borderRadius: 16,
              padding: "16px 10px 14px",
              textAlign: "center",
              textDecoration: "none",
              color: "#fafafa",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(165deg, rgba(32,32,36,0.95) 0%, rgba(20,20,24,1) 100%)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <EmberIcon ring="steel">📦</EmberIcon>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Add Packed</div>
            <div style={{ fontSize: 11, color: "rgba(228,228,231,0.55)" }}>
              Blister & card shots
            </div>
          </Link>
          <Link
            href="/capture-loose"
            style={{
              borderRadius: 16,
              padding: "16px 10px 14px",
              textAlign: "center",
              textDecoration: "none",
              color: "#fafafa",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(165deg, rgba(32,32,36,0.95) 0%, rgba(20,20,24,1) 100%)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <EmberIcon ring="steel">🏎️</EmberIcon>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Add Loose</div>
            <div style={{ fontSize: 11, color: "rgba(228,228,231,0.55)" }}>
              Loose runners on asphalt
            </div>
          </Link>
        </div>

        <Tile
          href="/mygarage"
          title="My Garage"
          subtitle="Open your collection — track every piece"
          icon={<span style={{ fontSize: 22 }}>🏁</span>}
          ring="ember"
          hero
          badge={garageBadge}
          chevron
        />

        <Tile
          href="/wishlist"
          title="Wishlist"
          subtitle="Collector wishlist — grail hunts & gaps"
          icon="🔥"
          ring="violet"
          chevron
        />

        <Tile
          title="Add Friends"
          subtitle="Pit lane with other collectors"
          icon="👥"
          ring="sage"
          disabled
          badge={
            <span
              style={{
                display: "inline-block",
                marginBottom: 6,
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "5px 9px",
                borderRadius: 999,
                border: "1px solid rgba(134,239,172,0.35)",
                color: "rgba(220,252,231,0.9)",
                background: "rgba(22,101,52,0.35)",
              }}
            >
              Coming soon
            </span>
          }
        />

        <Tile
          href="/howto"
          title="How To"
          subtitle="Lighting & angles for display-case shots"
          icon="📸"
          ring="flame"
          chevron
        />

        <p
          style={{
            margin: "22px 0 0",
            fontSize: 10,
            textAlign: "center",
            color: "rgba(161,161,170,0.55)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Experimental UI · not the live home
        </p>
      </div>
    </div>
  );
}
