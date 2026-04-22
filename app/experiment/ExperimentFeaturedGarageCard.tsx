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
 * “My Garage” (solo /experiment): contentShell = fila útil; leftBlock = columna a la
 * izquierda, centrada en vertical. Brillos/spot en experimentMyGarageCard.css, fuera del flujo.
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
        height: 124,
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
        className="contentShell"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          padding: "17px 20px",
        }}
      >
        <div
          className="leftBlock"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            height: "100%",
            flex: 1,
            minWidth: 0,
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
            fontSize: 30,
            fontWeight: 300,
            color: experimentFeaturedChevron,
            lineHeight: 1,
            flexShrink: 0,
          }}
          aria-hidden
        >
          {chev}
        </span>
      </div>
    </button>
  );
}
