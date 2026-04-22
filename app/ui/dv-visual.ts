import type { CSSProperties, MouseEvent } from "react";
import { t } from "./dv-tokens";

export const dvDisplayFont = `var(--dv-font-display), var(--dv-font-body), system-ui, sans-serif`;
export const dvBodyFont = `var(--dv-font-body), system-ui, sans-serif`;

const O = "255, 122, 24";

export function shellBackground(): string {
  return "linear-gradient(180deg, #0B0F17 0%, #07090D 45%, #07090D 100%)";
}

/** Signature orange (automotive accent) */
export const dvSignatureOrange = `${O}` as const;

const cardEdge = `0 0 0 1px ${t.borderSubtle}`;
const cardDepth = "0 8px 24px rgba(0,0,0,0.45)";
const cardInset = "inset 0 1px 0 rgba(255,255,255,0.05)";

const orangeFrame = `0 0 0 1px rgba(${O}, 0.18)`;
const orangeLift = "0 8px 24px rgba(255,122,24,0.14)";
const orangeHoverLift = "0 10px 28px rgba(255,122,24,0.12)";

export const dvModelCardBorder = `1px solid ${t.borderSubtle}`;

export const dvModelCardAmbientGlow = orangeLift;
export const dvModelCardHoverGlow = `${orangeFrame}, ${orangeHoverLift}`;

export const dvModelHeroImageBorder = "1.5px solid rgba(255, 154, 61, 0.55)";
export const dvModelHeroImageGlow = `0 0 10px rgba(${O}, 0.35), 0 0 0 1px rgba(${O}, 0.12)`;

export const dvModelListCardShadowRest = `${cardEdge}, ${cardDepth}, ${cardInset}`;
export const dvModelListCardShadowHover = `${orangeFrame}, ${cardDepth}, ${cardInset}, ${orangeHoverLift}`;

export const dvModelRowCardShadowRest = `${cardEdge}, 0 12px 32px rgba(0,0,0,0.4), ${cardInset}`;
export const dvModelRowCardShadowHover = `${orangeFrame}, 0 12px 32px rgba(0,0,0,0.4), ${cardInset}, 0 0 16px rgba(255,122,24,0.1)`;

export const dvModelListCardHoverHandlers = {
  onMouseEnter(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvModelListCardShadowHover;
  },
  onMouseLeave(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvModelListCardShadowRest;
  },
};

export const dvModelRowCardHoverHandlers = {
  onMouseEnter(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvModelRowCardShadowHover;
  },
  onMouseLeave(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvModelRowCardShadowRest;
  },
};

const heroBase = [
  orangeFrame,
  "0 10px 32px rgba(0,0,0,0.48)",
  "0 4px 16px rgba(0,0,0,0.3)",
  orangeLift,
  "inset 0 1px 0 rgba(255,255,255,0.06)",
  "inset 0 -1px 0 rgba(0,0,0,0.32)",
].join(", ");

const heroHover = [
  "0 0 0 1px rgba(255,122,24,0.26)",
  "0 12px 36px rgba(0,0,0,0.48)",
  "0 4px 16px rgba(0,0,0,0.3)",
  "0 10px 32px rgba(255,122,24,0.12)",
  "inset 0 1px 0 rgba(255,255,255,0.07)",
  "inset 0 -1px 0 rgba(0,0,0,0.3)",
].join(", ");

export const dvHeroShadow = heroBase;
export const dvHeroRowCardShadowHover = heroHover;

export const dvModelHeroRowCardHoverHandlers = {
  onMouseEnter(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvHeroRowCardShadowHover;
  },
  onMouseLeave(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvHeroShadow;
  },
};

const dvQuickTileShadowRest = `${cardEdge}, ${cardDepth}, ${cardInset}, ${orangeLift.replace("0.14", "0.08")}`;
const dvQuickTileShadowHover = `${orangeFrame}, 0 10px 30px rgba(0,0,0,0.4), ${cardInset}, 0 0 14px rgba(255,122,24,0.09)`;

export const dvModelQuickTileHoverHandlers = {
  onMouseEnter(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvQuickTileShadowHover;
  },
  onMouseLeave(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvQuickTileShadowRest;
  },
};

export const dvOrangeBorderSubtle = t.borderAccent;
export const dvOrangeGlowSubtle = t.orangeGlow;
export const dvIconOrangeMuted = t.orange400;

export const dvCardOrangeBorder = `rgba(${O}, 0.4)`;
export const dvQuickBorder = dvCardOrangeBorder;
export const dvQuickBoxShadow = `${cardEdge}, ${cardDepth}, ${cardInset}, ${orangeLift.replace("0.14", "0.1")}`;
export const dvHeroBorder = dvCardOrangeBorder;

export const dvPageShell: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
  padding: "20px 18px 32px",
  color: t.textPrimary,
  fontFamily: dvBodyFont,
  background: shellBackground(),
};

export const dvDashboardContentMaxPx = 400;

export const dvDashboardInner: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: dvDashboardContentMaxPx,
  margin: "0 auto",
  boxSizing: "border-box",
};

export const dvAppPageShell: CSSProperties = {
  ...dvPageShell,
  position: "relative",
};

export const dvInput: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: t.radiusMd,
  border: `1px solid ${t.borderSubtle}`,
  background: t.surface,
  color: t.textPrimary,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

export const dvSelect: CSSProperties = {
  ...dvInput,
  padding: "10px 12px",
  fontSize: 14,
};

export const dvGhostButton: CSSProperties = {
  padding: "8px 14px",
  borderRadius: 999,
  border: `1px solid ${t.borderMedium}`,
  background: "rgba(255,255,255,0.04)",
  color: t.textPrimary,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

export const dvPrimaryButton: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: t.radiusMd,
  border: `1px solid ${t.borderAccent}`,
  background: `linear-gradient(180deg, ${t.orange400} 0%, ${t.orange500} 100%)`,
  color: "#fff",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
  boxShadow: `0 4px 20px rgba(${O}, 0.18), 0 8px 24px rgba(0,0,0,0.35)`,
};

export const dvPrimaryButtonDisabled: CSSProperties = {
  ...dvPrimaryButton,
  background: t.surfaceElevated,
  border: `1px solid ${t.borderSubtle}`,
  boxShadow: "none",
  cursor: "not-allowed",
  opacity: 0.55,
};

export const dvRowCardBase: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "16px 16px",
  borderRadius: t.radiusLg,
  border: dvModelCardBorder,
  background: t.surface,
  boxShadow: dvModelRowCardShadowRest,
  cursor: "pointer",
  textAlign: "left",
  color: t.textPrimary,
  WebkitTapHighlightColor: "transparent",
};

export const dvHeroRowCard: CSSProperties = {
  ...dvRowCardBase,
  padding: "18px 16px",
  border: `1px solid ${t.borderAccent}`,
  background: t.surfaceElevated,
  boxShadow: dvHeroShadow,
};

export const dvQuickTile: CSSProperties = {
  ...dvRowCardBase,
  border: dvModelCardBorder,
  boxShadow: dvQuickTileShadowRest,
};

export const dvListCard: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: 12,
  borderRadius: t.radiusLg,
  background: t.surface,
  border: `1px solid ${t.borderSubtle}`,
  position: "relative",
  boxShadow: dvModelListCardShadowRest,
};

export const dvImageThumb: CSSProperties = {
  width: 70,
  height: 70,
  borderRadius: 16,
  overflow: "hidden",
  flexShrink: 0,
  background: t.bgSecondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1.5px solid ${t.borderAccent}`,
  boxShadow: `0 0 0 1px ${t.borderSubtle}, 0 6px 18px rgba(0,0,0,0.35)`,
};

export const dvTextSecondary: CSSProperties = { color: t.textSecondary };
export const dvTextMuted: CSSProperties = { color: t.textMuted };
