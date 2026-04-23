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
 * Favorites en /experiment: misma capa visual que My Garage (fondo, borde, sombra,
 * ::before/::after vía .experimentMyGarageCard + .experimentMyGarageGlint), sin coche.
 * Contenido: mismo layout que ExperimentMenuCard (icono, título, subtítulo, chevron).
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
        display: "block",
        width: "100%",
        height: "130px",
        padding: 0,
        margin: 0,
        marginBottom,
        borderRadius: experimentRadiusFeature,
        background: experimentHeroBackground,
        border: experimentHeroBorder,
        boxShadow: experimentHeroBoxShadow,
        cursor: "pointer",
        textAlign: "left",
        color: "#FFFFFF",
        WebkitTapHighlightColor: "transparent",
        overflow: "hidden",
        fontFamily: "inherit",
        lineHeight: "normal",
        boxSizing: "border-box",
        WebkitAppearance: "none" as const,
        appearance: "none",
      }}
    >
      <div className="experimentMyGarageGlint" aria-hidden />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          padding: "16px 18px",
          boxSizing: "border-box",
          gap: 16,
        }}
      >
        <div style={experimentMenuIconFrame}>{icon}</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
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
          }}
          aria-hidden
        >
          {chev}
        </span>
      </div>
    </button>
  );
}
