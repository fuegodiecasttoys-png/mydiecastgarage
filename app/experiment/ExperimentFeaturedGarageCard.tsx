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
 * “My Garage” — contenedor (minHeight 124, flex fila) con un solo hijo al flujo: la fila texto+›.
 * alignItems: center en ese contenedor centra el bloque entero; no usar dos hijos sueltos (desalinean el ›).
 * <button> reenvuelve; la barra naranja/metal del CSS aplica a .experimentMyGarageCard.
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
        lineHeight: 0,
        boxSizing: "border-box",
        WebkitAppearance: "none" as const,
        appearance: "none",
        marginBottom: 0,
      }}
    >
      <ExperimentCarDeco />
      <div className="experimentMyGarageGlint" aria-hidden />
      {/*
        Columna + justifyContent: center: el cuerpo a flujo mide 124 (border-box) y un solo hijo
        (fila) se coloca en el eje vertical; fiable aunque el nodo <button> herede raros del UA.
      */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: 124,
          width: "100%",
          boxSizing: "border-box",
          padding: "16px 20px 18px 20px",
          lineHeight: "normal",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            minHeight: 0,
            gap: 12,
            boxSizing: "border-box",
            flex: "0 0 auto",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flex: 1,
              minWidth: 0,
              flexDirection: "column",
              alignItems: "flex-start",
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
