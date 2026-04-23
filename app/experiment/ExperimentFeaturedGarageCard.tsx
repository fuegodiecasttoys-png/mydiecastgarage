"use client";

import type { ReactNode } from "react";
import {
  experimentHeroBackground,
  experimentHeroBorder,
  experimentHeroBoxShadow,
  experimentHeroBoxShadowHover,
  experimentFeaturedChevron,
  experimentHeroSubline,
  experimentRadiusFeature,
  experimentTextStrong,
} from "./experimentHeroStyle";
import { ExperimentCarDeco } from "./ExperimentCarDeco";
import "./experimentMyGarageCard.css";

const chev = "›" as const;

type Props = {
  onClick: () => void;
  title: string;
  lead: ReactNode;
  subline: string;
  displayFont: string;
};

/**
 * “My Garage” (solo /experiment): ancla horizontal del bloque al inicio del 2.º
 * tercio (centro de contenido en left: 33.33% con translateX -50%). Chevrón a
 * la der. Coche/glow fuera del flujo.
 */
export function ExperimentFeaturedGarageCard({ onClick, title, lead, subline, displayFont }: Props) {
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
        borderRadius: experimentRadiusFeature,
        background: experimentHeroBackground,
        border: experimentHeroBorder,
        boxShadow: experimentHeroBoxShadow,
        cursor: "pointer",
        textAlign: "left",
        color: experimentTextStrong,
        WebkitTapHighlightColor: "transparent",
        overflow: "hidden",
        fontFamily: "inherit",
        lineHeight: "normal",
        boxSizing: "border-box",
        WebkitAppearance: "none" as const,
        appearance: "none",
        marginBottom: 0,
      }}
    >
      <ExperimentCarDeco />
      <div className="experimentMyGarageGlint" aria-hidden />
      <div
        className="contentBlock"
        style={{
          position: "absolute",
          top: "50%",
          left: "33.333%",
          zIndex: 1,
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          className="title"
          style={{
            fontFamily: displayFont,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: 0,
            marginBottom: 7,
            lineHeight: 1.04,
            color: experimentTextStrong,
          }}
        >
          {title}
        </div>
        <div className="lead" style={{ margin: 0, marginBottom: 6 }}>
          {lead}
        </div>
        <div
          className="subline"
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: experimentHeroSubline,
            lineHeight: 1.32,
            letterSpacing: "0.01em",
          }}
        >
          {subline}
        </div>
      </div>
      <span
        className="chevron"
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          zIndex: 1,
          transform: "translateY(-50%)",
          fontSize: 30,
          fontWeight: 300,
          color: experimentFeaturedChevron,
          lineHeight: 1,
        }}
        aria-hidden
      >
        {chev}
      </span>
    </button>
  );
}
