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
 * “My Garage” — tarjeta protagonista: texto y chevron, coche de ambiente a la derecha.
 */
export function ExperimentFeaturedGarageCard({ onClick, title, lead, subline, displayFont }: Props) {
  return (
    <button
      type="button"
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
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        width: "100%",
        minHeight: 124,
        padding: "16px 20px 18px 20px",
        borderRadius: experimentRadiusFeature,
        background: experimentHeroBackground,
        border: experimentHeroBorder,
        boxShadow: experimentHeroBoxShadow,
        cursor: "pointer",
        textAlign: "left",
        color: experimentTextStrong,
        WebkitTapHighlightColor: "transparent",
        overflow: "hidden",
        gap: 12,
        fontFamily: "inherit",
        margin: 0,
        boxSizing: "border-box",
        marginBottom: 0,
      }}
    >
      <ExperimentCarDeco />
      <div className="experimentMyGarageGlint" aria-hidden />
      {/*
        Columna izq.: el padre estira (stretch) a la fila; el stack interno es 100% alto
        y flex column + justifyContent center = centrado vertical estructural.
      */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          alignSelf: "stretch",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            gap: 0,
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 8,
              lineHeight: 1.04,
              color: experimentTextStrong,
            }}
          >
            {title}
          </div>
          <div style={{ marginBottom: 7 }}>{lead}</div>
          <div
            style={{
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
      </div>
      <span
        style={{
          fontSize: 30,
          fontWeight: 300,
          color: experimentFeaturedChevron,
          lineHeight: 1,
          flexShrink: 0,
          alignSelf: "center",
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
