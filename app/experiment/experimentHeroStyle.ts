/**
 * /experiment-only visual system (reference: dark navy, gray material, orange edge light).
 * Does not affect production `/` or shared UI package.
 */
import type { CSSProperties } from "react";

/* —— Reference palette —— */
export const experimentAppBg = "#06090F";
export const experimentSurface = "#0B1220";
export const experimentSurfaceElevated = "#101827";
export const experimentHighlight = "rgba(255,255,255,0.06)";
export const experimentTextMuted = "rgba(255,255,255,0.58)";
export const experimentTextStrong = "#F3F4F6";
export const experimentOrange = "#FF9A1F";
export const experimentOrangeEdge = "#FFB347";
export const experimentOrangeGlow = "rgba(255,154,31,0.22)";

/* —— Page background (use with { ...dvPageShell, background: experimentAppBackground }) —— */
export const experimentAppBackground: string =
  "radial-gradient(120% 80% at 50% -20%, rgba(30, 55, 90, 0.12) 0%, transparent 50%)," +
  "linear-gradient(180deg, #080b12 0%, " +
  experimentAppBg +
  " 40%, #05060a 100%)";

/* —— My Garage hero —— */
const HERO_DARK =
  "linear-gradient(180deg, " + experimentSurfaceElevated + " 0%, " + experimentSurface + " 48%, #080c14 100%)";
const HERO_ORANGE_WASH =
  "linear-gradient(270deg, " +
  "rgba(255,154,31,0.2) 0%, " +
  "rgba(255,154,31,0.08) 32%, " +
  "rgba(255,120,30,0.02) 55%, " +
  "rgba(0,0,0,0) 72%)" +
  ", " +
  "linear-gradient(90deg, " +
  "rgba(255,255,255,0.05) 0%, " +
  "rgba(0,0,0,0) 45%)" +
  ", " +
  HERO_DARK;

export const experimentHeroBackground = HERO_ORANGE_WASH;

export const experimentHeroBoxShadow =
  "0 1px 0 0 rgba(255,255,255,0.04)," +
  "0 10px 32px rgba(0,0,0,0.55)," +
  "inset 0 1px 0 rgba(255,255,255,0.05)," +
  "inset 0 0 0 1px rgba(120, 140, 160, 0.08)";

export const experimentHeroBoxShadowHover =
  "0 1px 0 0 rgba(255,255,255,0.05)," +
  "0 12px 36px rgba(0,0,0,0.5)," +
  "inset 0 1px 0 rgba(255,255,255,0.06)," +
  "inset 0 0 0 1px rgba(120, 140, 160, 0.1)";

export const experimentHeroBorder =
  "1px solid rgba(255, 179, 71, 0.28)";

export const experimentHeroBadge = {
  background: "rgba(255, 154, 31, 0.1)",
  border: "1px solid rgba(255, 179, 71, 0.35)",
  color: "#FFB347" as const,
} as const;

export const experimentHeroIconBorder = "1px solid rgba(255, 179, 71, 0.32)";

export const experimentHeroIconBoxShadow =
  "inset 0 1px 0 rgba(255,255,255,0.06)," +
  "0 2px 8px rgba(0,0,0,0.45)," +
  "0 0 0 1px rgba(15, 25, 40, 0.5)";

export const experimentHeroChevron = experimentOrangeEdge;

export const experimentIconPrimary = experimentOrange;
export const experimentIconSofter = "#E08A1A";
export const experimentIconNeutral = "rgba(240, 244, 250, 0.88)";

/* —— Quick add tiles —— */
export const experimentQuickTileBackground =
  "linear-gradient(160deg, " +
  experimentSurfaceElevated +
  " 0%, " +
  experimentSurface +
  " 55%, #0a0f1a 100%)";

export const experimentQuickTileBorder = "1px solid rgba(120, 140, 160, 0.12)";

export const experimentQuickTileShadowRest =
  "0 0 0 1px rgba(0,0,0,0.35)," +
  "0 4px 16px rgba(0,0,0,0.5)," +
  "inset 0 1px 0 rgba(255,255,255,0.04)," +
  "inset 0 -1px 0 rgba(0,0,0,0.2)," +
  "0 0 20px -2px " +
  experimentOrangeGlow;

export const experimentQuickTileShadowHover =
  "0 0 0 1px rgba(255,154,31,0.15)," +
  "0 6px 22px rgba(0,0,0,0.52)," +
  "inset 0 1px 0 rgba(255,255,255,0.05)," +
  "0 0 24px -1px " +
  experimentOrangeGlow;

export const experimentQuickIconWrap: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  filter: "drop-shadow(0 0 4px " + experimentOrangeGlow + ")",
};

/* —— List rows (Favorites … How To) —— */
const LIST_INNER = experimentSurface;
const LIST_AMB =
  "linear-gradient(270deg, " +
  "rgba(255, 154, 31, 0.11) 0%, " +
  "rgba(255, 130, 50, 0.04) 30%, " +
  "rgba(0,0,0,0) 58%)" +
  ", " +
  "linear-gradient(90deg, " +
  "rgba(90, 110, 130, 0.06) 0%, " +
  "rgba(0,0,0,0) 42%)" +
  ", " +
  LIST_INNER;

export const experimentListIconFrame: CSSProperties = {
  lineHeight: 0,
  borderRadius: 14,
  background: "linear-gradient(180deg, #121a2a 0%, #0c121e 100%)",
  border: "1px solid rgba(100, 120, 150, 0.14)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.04)," +
    "inset 0 -1px 0 rgba(0,0,0,0.3)," +
    "0 0 0 1px rgba(255,154,31,0.08)",
  filter: "drop-shadow(0 0 1px rgba(255,154,31,0.15))",
};

export const experimentListTitle = experimentTextStrong;

export const experimentListChevron = "rgba(255, 179, 71, 0.75)";

export const experimentListRowPolish: CSSProperties = {
  boxShadow:
    "0 0 0 1px rgba(100, 120, 150, 0.1)," +
    "0 6px 16px rgba(0,0,0,0.4)",
  border: "1px solid rgba(100, 120, 150, 0.1)",
};

export const experimentListRowOrangeAccent: CSSProperties = {
  background: LIST_AMB,
  border: "1px solid rgba(255, 154, 31, 0.14)",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.5)," +
    "inset 0 1px 0 rgba(255,255,255,0.03)",
};

export const experimentListRowShadowRestWarm =
  "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)";

export const experimentListRowShadowHoverWarm =
  "0 8px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)";

export const experimentLogoHalo: CSSProperties = {
  filter: "drop-shadow(0 0 14px " + experimentOrangeGlow + ")",
};
