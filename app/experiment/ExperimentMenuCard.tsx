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

type Props = {
  onClick: () => void;
  /** Si no se pasa, no se muestra el frame ni el hueco a la izquierda. */
  icon?: ReactNode;
  title: ReactNode;
  subtitle: string;
  marginBottom: number;
};

/**
 * Standard secondary row: dark tile, left icon in frame, bold title, grey subtitle, orange chevron.
 */
export function ExperimentMenuCard({ onClick, icon, title, subtitle, marginBottom }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = experimentListRowShadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = experimentListRowShadowRest;
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
        ...experimentListRowOrangeAccent,
        boxShadow: experimentListRowShadowRest,
        border: experimentListRowOrangeAccent.border,
      }}
    >
      {icon != null ? <div style={experimentMenuIconFrame}>{icon}</div> : null}
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
