"use client";

import type { ReactNode } from "react";
import {
  experimentListChevron,
  experimentListRowOrangeAccent,
  experimentListRowShadowHover,
  experimentListRowShadowRest,
  experimentListTitle,
  experimentMenuIconFrame,
  experimentRadiusMenu,
  experimentTextMuted,
} from "./experimentHeroStyle";

const chev = "›" as const;

/** "favoritesCalm" = lenguaje visual tipo My Garage pero más oscuro y apagado. */
const favoritesCalmStyle = {
  backgroundImage:
    "linear-gradient(120deg, rgba(90, 120, 160, 0.05), transparent 60%)," +
    " linear-gradient(145deg, #0b0f14, #04060a)",
  border: "1px solid rgba(255,255,255,0.04)",
  restShadow: "0 0 8px rgba(0,0,0,0.6), 0 0 6px rgba(255,140,0,0.04)" as const,
  hoverShadow: "0 0 10px rgba(0,0,0,0.64), 0 0 8px rgba(255,140,0,0.055)" as const,
};

type Props = {
  onClick: () => void;
  icon: ReactNode;
  title: ReactNode;
  subtitle: string;
  marginBottom: number;
  /** Solo Favorites: superficie premium más oscura y en calma que el hero. */
  variant?: "default" | "favoritesCalm";
};

/**
 * Standard secondary row: dark tile, left icon in frame, bold title, grey subtitle, orange chevron.
 */
export function ExperimentMenuCard({ onClick, icon, title, subtitle, marginBottom, variant = "default" }: Props) {
  const isFavoritesCalm = variant === "favoritesCalm";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = isFavoritesCalm ? favoritesCalmStyle.hoverShadow : experimentListRowShadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isFavoritesCalm ? favoritesCalmStyle.restShadow : experimentListRowShadowRest;
      }}
      style={{
        display: "flex",
        width: "100%",
        minHeight: 80,
        alignItems: "center",
        padding: "16px 18px",
        boxSizing: "border-box",
        borderRadius: experimentRadiusMenu,
        cursor: "pointer",
        textAlign: "left",
        color: "#FFFFFF",
        fontFamily: "inherit",
        margin: 0,
        marginBottom,
        WebkitTapHighlightColor: "transparent",
        gap: 16,
        ...(isFavoritesCalm
          ? {
              background: "none",
              backgroundImage: favoritesCalmStyle.backgroundImage,
              boxShadow: favoritesCalmStyle.restShadow,
              border: favoritesCalmStyle.border,
            }
          : {
              ...experimentListRowOrangeAccent,
              boxShadow: experimentListRowShadowRest,
              border: experimentListRowOrangeAccent.border,
            }),
      }}
    >
      <div style={experimentMenuIconFrame}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: experimentListTitle,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: experimentTextMuted,
            lineHeight: 1.4,
            letterSpacing: "0.01em",
          }}
        >
          {subtitle}
        </div>
      </div>
      <span
        style={{ fontSize: 22, fontWeight: 300, lineHeight: 1, color: experimentListChevron, flexShrink: 0, opacity: 0.9 }}
        aria-hidden
      >
        {chev}
      </span>
    </button>
  );
}
