"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { t } from "./tokens";
import { IconCircle } from "../ui/IconCircle";
import { dvBodyFont, dvDisplayFont } from "../ui/dv-visual";

const MOCK_GARAGE_COUNT = 12;
const MOCK_WISHLIST_COUNT = 5;

function pieceLabel(count: number) {
  if (count === 0) return "No pieces yet";
  if (count === 1) return "1 model";
  return `${count} models`;
}

function wishlistLabel(count: number) {
  if (count === 0) return "Nothing listed";
  if (count === 1) return "1 item";
  return `${count} items`;
}

const fontVars: CSSProperties = {
  fontFamily: dvBodyFont,
  color: t.textPrimary,
};

const displayFont = dvDisplayFont;

/** Subtle orange system for secondary/tertiary cards (My Garage stays stronger). */
const expOrangeBorderSubtle = "rgba(255,106,0,0.25)";
const expOrangeGlowSubtle = "rgba(255,106,0,0.10)";
const expIconOrangeMuted = "#FF8124";

/** Quick actions: weakest orange tier (My Garage > Wishlist > Quick). */
const expQuickBorder = "rgba(255,106,0,0.18)";
const expQuickBoxShadow =
  "0 0 0 1px rgba(255,106,0,0.08), 0 10px 30px rgba(255,106,0,0.06)";
const expQuickBoxShadowHover =
  "0 0 0 1px rgba(255,106,0,0.13), 0 12px 34px rgba(255,106,0,0.09)";
const expQuickIconColor = "rgba(255,129,36,0.8)";

function IconPacked() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8l8-4 8 4v8l-8 4-8-4V8z"
        stroke={expQuickIconColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4 8l8 4M12 12v8M12 12l8-4" stroke={expQuickIconColor} strokeWidth="1.5" />
    </svg>
  );
}

function IconLoose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 16l6-10 6 10"
        stroke={expQuickIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="17" r="1.6" fill={expQuickIconColor} />
    </svg>
  );
}

function IconGarage() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10l8-5 8 5v9H4V10z"
        stroke={t.orange300}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 19v-5h6v5" stroke={t.textPrimary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconWishlist() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={expIconOrangeMuted}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFriends() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="3" stroke={expIconOrangeMuted} strokeWidth="1.5" />
      <circle cx="16" cy="10" r="2.5" stroke={expIconOrangeMuted} strokeWidth="1.5" />
      <path
        d="M4 19v-1a4 4 0 014-4h2M20 19v-1a3 3 0 00-3-3h-2"
        stroke={expIconOrangeMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHowTo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="7"
        width="14"
        height="11"
        rx="2"
        stroke={expIconOrangeMuted}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12.5" r="2" stroke={expIconOrangeMuted} strokeWidth="1.5" />
    </svg>
  );
}

function shellBackground(): string {
  return (
    "linear-gradient(180deg, #0B1018 0%, #090D14 32%, #07090D 62%, #050608 100%)"
  );
}

const HERO_SHADOW =
  "0 14px 36px rgba(0,0,0,0.42)," +
  "0 6px 16px rgba(0,0,0,0.28)," +
  "inset 0 1px 0 rgba(255,255,255,0.07)," +
  "inset 0 -1px 0 rgba(0,0,0,0.32)";

const HERO_SHADOW_HOVER =
  "0 18px 44px rgba(0,0,0,0.46)," +
  "0 8px 20px rgba(0,0,0,0.3)," +
  "inset 0 1px 0 rgba(255,255,255,0.09)," +
  "inset 0 -1px 0 rgba(0,0,0,0.3)";

export default function ExperimentPage() {
  const garageCount = MOCK_GARAGE_COUNT;
  const wishlistCount = MOCK_WISHLIST_COUNT;

  const quickBase: CSSProperties = {
    borderRadius: t.radiusLg,
    padding: "18px 14px 16px",
    textAlign: "center",
    textDecoration: "none",
    color: t.textPrimary,
    background: t.surface,
    border: `1px solid ${expQuickBorder}`,
    boxShadow: `${expQuickBoxShadow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
  };

  const heroCard: CSSProperties = {
    display: "block",
    textDecoration: "none",
    color: t.textPrimary,
    borderRadius: t.radiusXl,
    padding: "14px 20px 12px",
    background: t.surfaceElevated,
    border: "1px solid rgba(255,106,0,0.4)",
    boxShadow: HERO_SHADOW,
    marginBottom: t.spaceBlock,
    transition: "transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  };

  const secondaryCard: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 18px",
    borderRadius: t.radiusLg,
    textDecoration: "none",
    color: t.textPrimary,
    background: t.surface,
    border: `1px solid ${expOrangeBorderSubtle}`,
    boxShadow: `
      0 0 22px ${expOrangeGlowSubtle},
      0 12px 32px rgba(0,0,0,0.38),
      inset 0 1px 0 rgba(255,255,255,0.05)
    `,
    marginBottom: t.spaceTight,
    transition: "transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  };

  const tertiaryCard: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 16px",
    borderRadius: t.radiusLg,
    background: t.bgSecondary,
    border: `1px solid ${expOrangeBorderSubtle}`,
    boxShadow: `
      0 0 22px ${expOrangeGlowSubtle},
      inset 0 1px 0 rgba(255,255,255,0.04)
    `,
    marginBottom: t.spaceTight,
  };

  const tertiaryLink: CSSProperties = {
    ...tertiaryCard,
    textDecoration: "none",
    color: t.textPrimary,
    cursor: "pointer",
    transition: "transform 0.15s ease, border-color 0.2s ease",
  };

  return (
    <div
      style={{
        ...fontVars,
        minHeight: "100vh",
        width: "100%",
        padding: "24px 20px 32px",
        boxSizing: "border-box",
        background: shellBackground(),
      }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: t.spaceSection,
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: t.textSecondary,
              textDecoration: "none",
            }}
          >
            ← Home
          </Link>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: t.textMuted,
            }}
          >
            Preview
          </span>
        </div>

        <header
          style={{
            marginBottom: t.spaceSection,
            marginTop: 0,
            paddingTop: 6,
            paddingBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="My Diecast Garage"
              width={120}
              style={{
                display: "block",
                width: 120,
                maxWidth: "min(120px, 100%)",
                height: "auto",
                filter: "brightness(0.92) saturate(0.86)",
              }}
            />
          </div>
        </header>

        <p
          style={{
            margin: "0 0 14px",
            fontFamily: displayFont,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: t.textPrimary,
          }}
        >
          Quick add
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: t.spaceTight,
            marginBottom: t.spaceSection,
          }}
        >
          <Link
            href="/capture-packed"
            style={quickBase}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,106,0,0.26)";
              e.currentTarget.style.boxShadow = `${expQuickBoxShadowHover}, inset 0 1px 0 rgba(255,255,255,0.06)`;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = expQuickBorder;
              e.currentTarget.style.boxShadow = `${expQuickBoxShadow}, inset 0 1px 0 rgba(255,255,255,0.05)`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <IconCircle variant="orangeQuick">
                <IconPacked />
              </IconCircle>
            </div>
            <div
              style={{
                fontFamily: displayFont,
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 4,
                color: t.textPrimary,
              }}
            >
              Add Packed
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.textMuted }}>
              Carded & blister
            </div>
          </Link>
          <Link
            href="/capture-loose"
            style={quickBase}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,106,0,0.26)";
              e.currentTarget.style.boxShadow = `${expQuickBoxShadowHover}, inset 0 1px 0 rgba(255,255,255,0.06)`;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = expQuickBorder;
              e.currentTarget.style.boxShadow = `${expQuickBoxShadow}, inset 0 1px 0 rgba(255,255,255,0.05)`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <IconCircle variant="orangeQuick">
                <IconLoose />
              </IconCircle>
            </div>
            <div
              style={{
                fontFamily: displayFont,
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 4,
                color: t.textPrimary,
              }}
            >
              Add Loose
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.textMuted }}>
              Runners & displays
            </div>
          </Link>
        </div>

        <Link
          href="/mygarage"
          style={heroCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = HERO_SHADOW_HOVER;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = HERO_SHADOW;
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 0,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <IconCircle variant="accent">
                <IconGarage />
              </IconCircle>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                marginLeft: 28,
                paddingLeft: 20,
                paddingRight: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 5,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: `linear-gradient(90deg, rgba(255,106,0,0.2), rgba(255,129,36,0.12))`,
                    border: `1px solid rgba(255,106,0,0.35)`,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: t.orange300,
                    lineHeight: 1.2,
                  }}
                >
                  {pieceLabel(garageCount)}
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: displayFont,
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: t.textPrimary,
                    lineHeight: 1.05,
                  }}
                >
                  My Garage
                </h2>
              </div>
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.32,
                  color: t.textSecondary,
                }}
              >
                Track every piece
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  color: t.orange400,
                  lineHeight: 1.2,
                }}
              >
                Open collection
                <span aria-hidden style={{ fontSize: 18, fontWeight: 300 }}>
                  →
                </span>
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/wishlist"
          style={secondaryCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,106,0,0.38)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = expOrangeBorderSubtle;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <IconCircle variant="orangeSubtle">
            <IconWishlist />
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: displayFont,
                  fontSize: 16,
                  fontWeight: 700,
                  color: t.textPrimary,
                }}
              >
                Wishlist
              </h3>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: t.textMuted,
                }}
              >
                {wishlistLabel(wishlistCount)}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.45,
                color: t.textSecondary,
              }}
            >
              Grails & missing casts
            </p>
          </div>
          <span style={{ fontSize: 20, color: t.textMuted, flexShrink: 0 }} aria-hidden>
            ›
          </span>
        </Link>

        <Link
          href="/friends"
          style={tertiaryLink}
          aria-label="Add friends"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,106,0,0.38)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = expOrangeBorderSubtle;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <IconCircle variant="orangeSubtle">
            <IconFriends />
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                margin: "0 0 6px",
                fontFamily: displayFont,
                fontSize: 16,
                fontWeight: 700,
                color: t.textPrimary,
              }}
            >
              Add Friends
            </h3>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: t.textSecondary }}>
              View trusted collectors&apos; garages (read-only)
            </p>
          </div>
          <span style={{ fontSize: 20, color: t.textMuted, flexShrink: 0 }} aria-hidden>
            ›
          </span>
        </Link>

        <Link
          href="/howto"
          style={tertiaryLink}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,106,0,0.38)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = expOrangeBorderSubtle;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <IconCircle variant="orangeSubtle">
            <IconHowTo />
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                margin: "0 0 6px",
                fontFamily: displayFont,
                fontSize: 16,
                fontWeight: 700,
                color: t.textPrimary,
              }}
            >
              How To
            </h3>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: t.textSecondary }}>
              Lighting & angles for showcase shots
            </p>
          </div>
          <span style={{ fontSize: 20, color: t.textMuted, flexShrink: 0 }} aria-hidden>
            ›
          </span>
        </Link>

        <footer style={{ marginTop: 28, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.textMuted,
            }}
          >
            Experimental screen · not the live home
          </p>
        </footer>
      </div>
    </div>
  );
}
