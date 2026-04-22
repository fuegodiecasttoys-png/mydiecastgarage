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
 * “My Garage” — cuerpo con height: 124 (px reales) para que la fila y el bloque
 * izquierdo tengan altura definida; justifyContent center en la columna de textos. Coche/glow sin cambios.
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
      {/*
        Altura fija 124 (border-box) = altura real; la fila al 100% del cuerpo útil y
        el bloque izquierdo rellena + justifyContent center.
      */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: 124,
          width: "100%",
          boxSizing: "border-box",
          padding: "17px 20px 17px 20px",
          lineHeight: "normal",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            width: "100%",
            minWidth: 0,
            gap: 12,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flex: 1,
              minWidth: 0,
              height: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontFamily: displayFont,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: 0,
                marginBottom: 7,
                lineHeight: 1.04,
                color: experimentTextStrong,
              }}
            >
              {title}
            </div>
            <div style={{ marginTop: 0, marginBottom: 6 }}>{lead}</div>
            <div
              style={{
                marginTop: 0,
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
            style={{
              fontSize: 30,
              fontWeight: 300,
              color: experimentFeaturedChevron,
              lineHeight: 1,
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
            aria-hidden
          >
            {chev}
          </span>
        </div>
      </div>
    </button>
  );
}
