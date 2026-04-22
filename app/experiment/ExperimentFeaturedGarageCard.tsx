"use client";

import type { ReactNode } from "react";
import {
  experimentHeroBackground,
  experimentHeroBorder,
  experimentHeroBoxShadow,
  experimentHeroBoxShadowHover,
  experimentHeroChevron,
  experimentHeroIconBox,
  experimentIconPrimary,
  experimentRadiusFeature,
  experimentTextStrong,
} from "./experimentHeroStyle";
import { ExperimentCarDeco } from "./ExperimentCarDeco";
import { ExpIconHouse } from "./experimentIcons";

const chev = "›" as const;

type Props = {
  onClick: () => void;
  title: string;
  lead: ReactNode;
  subline: string;
  displayFont: string;
};

/**
 * Protagonist “My Garage” card — strong rim light, right-side car, garage icon, orange chevron.
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
        alignItems: "center",
        width: "100%",
        minHeight: 160,
        padding: "20px 18px 20px 20px",
        borderRadius: experimentRadiusFeature,
        background: experimentHeroBackground,
        border: experimentHeroBorder,
        boxShadow: experimentHeroBoxShadow,
        cursor: "pointer",
        textAlign: "left",
        color: experimentTextStrong,
        WebkitTapHighlightColor: "transparent",
        overflow: "hidden",
        gap: 16,
        fontFamily: "inherit",
        margin: 0,
        boxSizing: "border-box",
        marginBottom: 0,
      }}
    >
      <ExperimentCarDeco />
      <div style={{ ...experimentHeroIconBox, zIndex: 2 }}>
        <ExpIconHouse color={experimentIconPrimary} size={26} />
      </div>
      <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 2 }}>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 10,
            lineHeight: 1.1,
            color: experimentTextStrong,
          }}
        >
          {title}
        </div>
        <div style={{ marginBottom: 8 }}>{lead}</div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#A9B0BC",
            lineHeight: 1.4,
            letterSpacing: "0.01em",
          }}
        >
          {subline}
        </div>
      </div>
      <span
        style={{
          fontSize: 26,
          fontWeight: 200,
          color: experimentHeroChevron,
          lineHeight: 1,
          flexShrink: 0,
          position: "relative",
          zIndex: 2,
        }}
        aria-hidden
      >
        {chev}
      </span>
    </button>
  );
}
