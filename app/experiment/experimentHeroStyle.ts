/**
 * /experiment-only visual tokens (My Garage, quick actions, list rhythm).
 * Does not affect production `/` or shared UI package.
 */

import type { CSSProperties } from "react";

/* —— My Garage hero —— */
export const experimentHeroBoxShadow =
  "0 0 0 1px rgba(255,122,24,0.3)," +
  "0 6px 20px rgba(0,0,0,0.58)," +
  "inset 0 1px 0 rgba(255,160,100,0.1)," +
  "inset 0 -1px 0 rgba(0,0,0,0.25)," +
  "inset 0 0 0 1px rgba(255,122,24,0.04)";

export const experimentHeroBoxShadowHover =
  "0 0 0 1px rgba(255,122,24,0.38)," +
  "0 8px 24px rgba(0,0,0,0.52)," +
  "inset 0 1px 0 rgba(255,170,110,0.12)," +
  "inset 0 -1px 0 rgba(0,0,0,0.2)," +
  "inset 0 0 0 1px rgba(255,122,24,0.07)";

export const experimentHeroBackground =
  "linear-gradient(180deg, #1A1F2A 0%, #0F1218 55%, #0C0F16 100%)";

export const experimentHeroBorder = "1px solid rgba(255,122,24,0.38)";

export const experimentHeroBadge = {
  background: "rgba(255,122,24,0.2)",
  border: "1px solid rgba(255,150,60,0.4)",
  color: "#FFBC70" as const,
} as const;

export const experimentHeroIconBorder = "1px solid rgba(255,150,60,0.4)";

export const experimentHeroIconBoxShadow =
  "0 4px 12px rgba(0,0,0,0.4)," +
  "inset 0 1px 0 rgba(255,170,120,0.14)," +
  "inset 0 0 8px rgba(255,122,24,0.06)";

export const experimentHeroChevron = "#FF9A3D";

/* —— Quick add tiles —— */
export const experimentQuickTileShadowRest =
  "0 0 0 1px rgba(255,255,255,0.1)," +
  "0 4px 14px rgba(0,0,0,0.42)," +
  "inset 0 0 0 1px rgba(255,122,24,0.12)," +
  "inset 0 1px 0 rgba(255,140,80,0.08)";

export const experimentQuickTileShadowHover =
  "0 0 0 1px rgba(255,255,255,0.1)," +
  "0 0 0 1px rgba(255,122,24,0.26)," +
  "0 6px 18px rgba(0,0,0,0.45)," +
  "inset 0 1px 0 rgba(255,150,90,0.1)";

export const experimentQuickTileBackground =
  "linear-gradient(180deg, rgba(255,122,24,0.09) 0%, #10141C 45%, #0C0F16 100%)";

export const experimentQuickTileBorder = "1px solid rgba(255,122,24,0.24)";

export const experimentQuickEmojiStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  filter: "saturate(1.18) contrast(1.04)",
  WebkitFilter: "saturate(1.18) contrast(1.04)",
};

/* —— Secondary list rows (Favorites, Wishlist, Add Friends, How To only) —— */
const LIST_AMBIENT_BG =
  "linear-gradient(270deg, " +
  "rgba(255,122,24,0.162) 0%, " +
  "rgba(255,122,24,0.09) 25%, " +
  "rgba(255,122,24,0.036) 45%, " +
  "rgba(0,0,0,0) 65%)" +
  ", #101725";

/** Coherent with list cards; no outer glow, subtle right-side accent ring only. */
export const experimentListIconFrame: CSSProperties = {
  lineHeight: 0,
  borderRadius: 14,
  border: "1px solid rgba(255,122,24,0.162)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

export const experimentListTitle = "rgba(252,252,255,0.98)";

export const experimentListChevron = "rgba(220, 228, 238, 0.7)";

export const experimentListRowPolish: CSSProperties = {
  boxShadow:
    "0 0 0 1px rgba(255,255,255,0.1)," +
    "0 6px 16px rgba(0,0,0,0.4)," +
    "inset 0 1px 0 rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
};

/**
 * Right edge ambient light, long fade left; no orange in shadow (hover handlers use strings below).
 * Opacities ≈10% under reference values (premium, not neon).
 */
export const experimentListRowOrangeAccent: CSSProperties = {
  background: LIST_AMBIENT_BG,
  border: "1px solid rgba(255,122,24,0.198)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
};

export const experimentListRowShadowRestWarm = "0 6px 18px rgba(0,0,0,0.6)";

export const experimentListRowShadowHoverWarm = "0 8px 22px rgba(0,0,0,0.58)";

export const experimentLogoHalo: CSSProperties = {
  filter: "drop-shadow(0 0 12px rgba(255,122,24,0.1))",
};
