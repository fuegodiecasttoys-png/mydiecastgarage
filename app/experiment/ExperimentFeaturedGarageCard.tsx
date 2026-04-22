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
 * “My Garage” — cuerpo en columna; fila interior (100% altura útil) con alignItems center;
 * bloque título|badge|sub: flex col + justifyContent center, texto a la izquierda (alignItems start).
 * Coche/glow sin cambios.
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
        Padre: columna, min 124, sin justifyContent: center en el cuerpo (el centrado vive en la fila
        y en el bloque título+lead+sub).
        Último hijo a flujo: fila (display flex, align-items: center, flex 1) llena el alto.
      */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 124,
          width: "100%",
          boxSizing: "border-box",
          padding: "16px 20px 18px 20px",
          lineHeight: "normal",
        }}
      >
        {/*
          Padre inmediato del bloque izquierdo: fila, altura del área útil, alinea a media altura.
        */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            flex: 1,
            gap: 12,
            boxSizing: "border-box",
          }}
        >
          {/*
            Bloque: título + badge + sublínea; a la izquierda; el grupo se centra en el eje de la fila
            (alignSelf center) y justify center si la columna tuviera alto extra.
          */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              alignSelf: "center",
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
                marginBottom: 8,
                lineHeight: 1.04,
                color: experimentTextStrong,
              }}
            >
              {title}
            </div>
            <div style={{ marginTop: 0, marginBottom: 7 }}>{lead}</div>
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
