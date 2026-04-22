"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { t } from "./tokens";
import { IconCircle } from "../ui/IconCircle";
import { AccentBadge } from "../ui/AccentBadge";
import {
  dvAppPageShell,
  dvCardOrangeBorder,
  dvDashboardInner,
  dvDisplayFont,
  dvHeroRowCard,
  dvModelHeroRowCardHoverHandlers,
  dvModelQuickTileHoverHandlers,
  dvModelRowCardHoverHandlers,
  dvQuickTile,
  dvRowCardBase,
} from "../ui/dv-visual";

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

const chevronStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 300,
  opacity: 0.85,
  marginLeft: 8,
  flexShrink: 0,
};

const rowCardBase = dvRowCardBase;

const expIconOrangeMuted = "#FF9A3D";
const expQuickIconColor = "rgba(255, 154, 61, 0.8)";

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

export default function ExperimentPage() {
  const garageCount = MOCK_GARAGE_COUNT;
  const wishlistCount = MOCK_WISHLIST_COUNT;

  return (
    <div style={dvAppPageShell}>
      <Link
        href="/"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          textDecoration: "none",
          color: t.textPrimary,
          fontSize: 20,
          zIndex: 10,
        }}
      >
        🏠
      </Link>

      <div style={dvDashboardInner}>
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <div
            style={{
              display: "inline-block",
              filter: "drop-shadow(0 0 10px rgba(255,122,24,0.08))",
            }}
          >
            <img
              src="/logo.png"
              alt="My Diecast Garage"
              width={120}
              style={{
                width: 120,
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: t.textMuted,
            }}
          >
            UI preview
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
            marginTop: 18,
          }}
        >
          <Link
            href="/capture-packed"
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
              <IconCircle variant="orangeQuick">
                <IconPacked />
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
                  color: t.textMuted,
                  lineHeight: 1.35,
                }}
              >
                Carded & blister
              </div>
            </div>
          </Link>
          <Link
            href="/capture-loose"
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
              <IconCircle variant="orangeQuick">
                <IconLoose />
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
                  color: t.textMuted,
                  lineHeight: 1.35,
                }}
              >
                Runners & displays
              </div>
            </div>
          </Link>
        </div>

        <Link
          href="/mygarage"
          {...dvModelHeroRowCardHoverHandlers}
          style={{
            ...dvHeroRowCard,
            marginBottom: 12,
            minHeight: 120,
            border: `2px solid ${dvCardOrangeBorder}`,
          }}
        >
          <IconCircle variant="accent">
            <IconGarage />
          </IconCircle>
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
                <span style={{ fontSize: 11, opacity: 0.95 }} aria-hidden>
                  📦
                </span>
                {pieceLabel(garageCount)}
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
        </Link>

        <Link
          href="/wishlist"
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 12 }}
        >
          <IconCircle variant="neutral">
            <IconWishlist />
          </IconCircle>
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
                Wishlist
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: t.textMuted,
                }}
              >
                {wishlistLabel(wishlistCount)}
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.35,
              }}
            >
              Grails & missing casts
            </div>
          </div>
          <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
            ›
          </span>
        </Link>

        <Link
          href="/friends"
          aria-label="Add friends"
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 12 }}
        >
          <IconCircle variant="orangeSubtle">
            <IconFriends />
          </IconCircle>
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
        </Link>

        <Link
          href="/howto"
          {...dvModelRowCardHoverHandlers}
          style={{ ...rowCardBase, marginBottom: 0 }}
        >
          <IconCircle variant="orangeSubtle">
            <IconHowTo />
          </IconCircle>
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
