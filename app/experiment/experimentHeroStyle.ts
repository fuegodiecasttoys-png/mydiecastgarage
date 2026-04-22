/**
 * /experiment — premium automotive UI tokens (MY DIECAST GARAGE mock).
 * Edit only this file in /experiment for palette; page shell stays app-agnostic.
 */
import type { CSSProperties } from "react";

/* —— Palette (mock) —— */
export const experimentAppBg = "#05070B";
export const experimentSurfaceA = "#0A0F18";
export const experimentSurfaceB = "#0F1722";
export const experimentSurfaceC = "#111827";
export const experimentTextStrong = "#FFFFFF";
export const experimentTextMuted = "#A9B0BC";
export const experimentOrange = "#FF9F0A";
export const experimentOrangeEdge = "#FFB347";
export const experimentOrangeSoft = "rgba(255, 159, 10, 0.12)";
export const experimentOrangeGlow = "rgba(255, 152, 0, 0.16)";

export const experimentRadiusFeature = 24;
export const experimentRadiusMenu = 20;
export const experimentRadiusIcon = 16;
export const experimentPagePaddingX = 20;
export const experimentPagePaddingY = 24;
export const experimentListGap = 12;
export const experimentFeatureBottomMargin = 20;

/* —— Page —— */
export const experimentAppBackground: string =
  "radial-gradient(100% 60% at 50% 0%, rgba(25, 40, 65, 0.2) 0%, transparent 52%)," +
  "linear-gradient(180deg, #06080e 0%, " +
  experimentAppBg +
  " 35%, #020305 100%)";

export const experimentContentMax: CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  position: "relative" as const,
  width: "100%",
  boxSizing: "border-box",
};

export const experimentLogoHalo: CSSProperties = {
  filter: "drop-shadow(0 0 20px " + experimentOrangeGlow + ")",
};

/* —— Featured “My Garage” (test visuals — neutral charcoal + metal edge) —— */
const HERO_LATERAL = "linear-gradient(to right, rgba(255, 102, 0, 0.15), transparent 40%)";
const HERO_BASE_FILL = "linear-gradient(145deg, #121212, #050505)";

export const experimentHeroBackground = HERO_LATERAL + ", " + HERO_BASE_FILL;

/** “My Garage” lead/sub copy — feature card only. */
export const experimentHeroSubline = "rgba(255, 255, 255, 0.72)";

export const experimentHeroBoxShadow =
  "0 0 16px rgba(255, 102, 0, 0.16)," +
  "0 0 5px rgba(255, 140, 0, 0.18)," +
  "inset 0 0 25px rgba(255, 255, 255, 0.02)," +
  "inset 0 0 10px rgba(0, 0, 0, 0.6)";

export const experimentHeroBoxShadowHover =
  "0 0 28px rgba(255, 102, 0, 0.30)," +
  "inset 0 0 25px rgba(255, 255, 255, 0.03)," +
  "inset 0 0 10px rgba(0, 0, 0, 0.55)";

export const experimentHeroBorder = "1px solid rgba(255, 140, 0, 0.12)";

export const experimentHeroBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "5px 12px",
  minHeight: 28,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.02em",
  borderRadius: 999,
  color: "#FFB85C",
  background: "linear-gradient(180deg, rgba(40, 28, 8, 0.65) 0%, rgba(25, 16, 4, 0.8) 100%)",
  border: "1px solid rgba(255, 197, 120, 0.3)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 220, 160, 0.1)," + "0 0 0 1px rgba(0,0,0,0.2)," + "0 2px 8px rgba(0,0,0,0.4)",
};

export const experimentHeroBadgeMuted: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 12px",
  minHeight: 28,
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 999,
  color: "rgba(255, 200, 200, 0.9)",
  background: "rgba(30, 12, 12, 0.45)",
  border: "1px solid rgba(255, 100, 100, 0.2)",
};

export const experimentHeroIconBox: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: experimentRadiusIcon,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  position: "relative" as const,
  zIndex: 2,
  background: "linear-gradient(165deg, #151d2e 0%, #0b101c 100%)",
  border: "1px solid rgba(255, 170, 90, 0.28)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.05)," + "0 4px 14px rgba(0,0,0,0.45)" + ", 0 0 0 1px rgba(0,0,0,0.35)",
};

export const experimentHeroChevron = experimentOrangeEdge;

/** Featured “My Garage” chevron — ligeramente más presente, sigue sutil. */
export const experimentFeaturedChevron = "rgba(255, 196, 128, 0.95)";

/* —— Quick add (2-up) —— */
export const experimentQuickTileBackground =
  "linear-gradient(155deg, " + experimentSurfaceC + " 0%, " + experimentSurfaceA + " 100%)";

export const experimentQuickTileBorder = "1px solid rgba(95, 115, 140, 0.18)";

export const experimentQuickTileShadowRest =
  "0 0 0 1px rgba(0,0,0,0.4)," +
  "0 6px 20px rgba(0,0,0,0.5)," +
  "inset 0 1px 0 rgba(255,255,255,0.04)," +
  "0 0 24px -4px " +
  experimentOrangeGlow;

export const experimentQuickTileShadowHover =
  "0 0 0 1px rgba(255, 159, 10, 0.16)," +
  "0 8px 24px rgba(0,0,0,0.5)," +
  "inset 0 1px 0 rgba(255,255,255,0.05)," +
  "0 0 28px -2px " +
  experimentOrangeGlow;

export const experimentQuickIconWrap: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  filter: "drop-shadow(0 0 6px rgba(255, 159, 10, 0.18))",
};

/* —— Standard menu rows —— */
const LIST_CORE =
  "linear-gradient(98deg, " + experimentSurfaceB + " 0%, " + experimentSurfaceA + " 55%, rgba(17, 24, 39, 0.92) 100%)" +
  ", " +
  "linear-gradient(270deg, rgba(255, 160, 40, 0.05) 0%, transparent 50%)";

export const experimentListRowBase: CSSProperties = {
  background: LIST_CORE,
  border: "1px solid rgba(120, 135, 160, 0.14)",
  boxShadow:
    "0 2px 0 rgba(255,255,255,0.02), 0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
};

export const experimentListRowShadowRest = experimentListRowBase.boxShadow as string;
export const experimentListRowShadowHover =
  "0 2px 0 rgba(255,255,255,0.03), 0 10px 26px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.05)";

export const experimentMenuIconFrame: CSSProperties = {
  width: 48,
  height: 48,
  lineHeight: 0,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  background: "linear-gradient(180deg, #121a2a 0%, #0a101c 100%)",
  border: "1px solid rgba(100, 120, 150, 0.16)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.35)",
};

export const experimentListTitle = experimentTextStrong;
export const experimentListChevron = "rgba(255, 191, 120, 0.9)";

export const experimentIconPrimary = experimentOrange;

/** Merged into menu `button` styles (same as list row system). */
export const experimentListRowOrangeAccent: CSSProperties = { ...experimentListRowBase };
