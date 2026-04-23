"use client";

import type { ReactNode } from "react";
import {
  experimentHeroBackground,
  experimentHeroBorder,
  experimentHeroBoxShadow,
  experimentHeroBoxShadowHover,
  experimentListChevron,
  experimentListTitle,
  experimentMenuIconFrame,
  experimentRadiusFeature,
  experimentTextMuted,
} from "./experimentHeroStyle";
import "./experimentMyGarageCard.css";

const chev = "›" as const;

type Props = {
  onClick: () => void;
  icon: ReactNode;
  title: ReactNode;
  subtitle: string;
  marginBottom: number;
};

/**
 * Favorites: piel My Garage. Estructura de fila y altura = ExperimentMenuCard (Wishlist):
 * mismo minHeight, padding, display flex, alignItems, gap 16, tres hijos a flujo; sin wrapper extra.
 */
export function ExperimentFavoritesGarageCard({ onClick, icon, title, subtitle, marginBottom }: Props) {
  return (
    <button
      type="button"
      className="experimentMyGarageCard"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = experimentHeroBoxShadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = experimentHeroBoxShadow;
      }}
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        minHeight: 80,
        alignItems: "center",
        padding: "16px 18px",
        boxSizing: "border-box",
        borderRadius: experimentRadiusFeature,
        background: experimentHeroBackground,
        border: experimentHeroBorder,
        boxShadow: experimentHeroBoxShadow,
        cursor: "pointer",
        textAlign: "left",
        color: "#FFFFFF",
        fontFamily: "inherit",
        margin: 0,
        marginBottom,
        WebkitTapHighlightColor: "transparent",
        gap: 16,
        overflow: "hidden",
        WebkitAppearance: "none" as const,
        appearance: "none",
      }}
    >
      <div className="experimentMyGarageGlint" aria-hidden />
      <div
        style={{
          ...experimentMenuIconFrame,
          position: "relative",
          zIndex: 1,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
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
        style={{
          fontSize: 22,
          fontWeight: 300,
          lineHeight: 1,
          color: experimentListChevron,
          flexShrink: 0,
          opacity: 0.9,
          position: "relative",
          zIndex: 1,
        }}
        aria-hidden
      >
        {chev}
      </span>
    </button>
  );
}
