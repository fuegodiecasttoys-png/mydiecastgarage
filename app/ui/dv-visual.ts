import type { CSSProperties, MouseEvent } from "react";
import { t } from "./dv-tokens";

export const dvDisplayFont = `var(--dv-font-display), var(--dv-font-body), system-ui, sans-serif`;
export const dvBodyFont = `var(--dv-font-body), system-ui, sans-serif`;

export function shellBackground(): string {
  return "linear-gradient(180deg, #0B1018 0%, #090D14 32%, #07090D 62%, #050608 100%)";
}

/** Signature orange (dark-canvas premium accent). */
export const dvSignatureOrange = "255, 140, 0" as const;

export const dvModelCardBorder = `1.5px solid rgba(${dvSignatureOrange}, 0.5)`;
export const dvModelCardAmbientGlow = `0 0 10px rgba(${dvSignatureOrange}, 0.25)`;
export const dvModelCardHoverGlow = `0 0 14px rgba(${dvSignatureOrange}, 0.7)`;

/** Main diecast hero photo — brighter ring + visible glow. */
export const dvModelHeroImageBorder = "1.5px solid rgba(255, 165, 0, 0.82)";
export const dvModelHeroImageGlow = `0 0 12px rgba(${dvSignatureOrange}, 0.6)`;

export const dvModelListCardShadowRest = `${dvModelCardAmbientGlow}, 0 10px 28px rgba(0,0,0,0.35)`;
export const dvModelListCardShadowHover = `${dvModelCardHoverGlow}, 0 10px 28px rgba(0,0,0,0.35)`;

export const dvModelRowCardShadowRest = `${dvModelCardAmbientGlow}, 0 12px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)`;
export const dvModelRowCardShadowHover = `${dvModelCardHoverGlow}, 0 12px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)`;

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

export const dvOrangeBorderSubtle = `rgba(${dvSignatureOrange}, 0.28)`;
export const dvOrangeGlowSubtle = `rgba(${dvSignatureOrange}, 0.12)`;
export const dvIconOrangeMuted = "#FF8124";

/** Color when border width is set separately (e.g. `2px solid ${dvCardOrangeBorder}`). */
export const dvCardOrangeBorder = `rgba(${dvSignatureOrange}, 0.5)`;

/** @deprecated Prefer `dvCardOrangeBorder`; kept as alias for older imports. */
export const dvQuickBorder = dvCardOrangeBorder;
export const dvQuickBoxShadow = `${dvModelCardAmbientGlow}, 0 10px 30px rgba(0,0,0,0.32)`;

/** @deprecated Prefer `dvCardOrangeBorder`; kept as alias for older imports. */
export const dvHeroBorder = dvCardOrangeBorder;
export const dvHeroShadow = `${dvModelCardAmbientGlow}, 0 14px 36px rgba(0,0,0,0.42), 0 6px 16px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.32)`;

export const dvHeroRowCardShadowHover = `${dvModelCardHoverGlow}, 0 14px 36px rgba(0,0,0,0.42), 0 6px 16px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.32)`;

export const dvModelHeroRowCardHoverHandlers = {
  onMouseEnter(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvHeroRowCardShadowHover;
  },
  onMouseLeave(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvHeroShadow;
  },
};

const dvQuickTileShadowRest = `${dvQuickBoxShadow}, inset 0 1px 0 rgba(255,255,255,0.05)`;
const dvQuickTileShadowHover = `${dvModelCardHoverGlow}, 0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`;

export const dvModelQuickTileHoverHandlers = {
  onMouseEnter(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvQuickTileShadowHover;
  },
  onMouseLeave(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.boxShadow = dvQuickTileShadowRest;
  },
};

export const dvPageShell: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
  padding: "20px 18px 32px",
  color: t.textPrimary,
  fontFamily: dvBodyFont,
  background: shellBackground(),
};

/** Home (`/`) inner column width — default for list / tool pages. */
export const dvDashboardContentMaxPx = 400;

/** Centered column matching the home dashboard hub. */
export const dvDashboardInner: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: dvDashboardContentMaxPx,
  margin: "0 auto",
  boxSizing: "border-box",
};

/** `dvPageShell` + `position: relative` for absolute corner controls (🏠, etc.). */
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
  border: `1px solid rgba(${dvSignatureOrange}, 0.58)`,
  background: `linear-gradient(180deg, ${t.orange400} 0%, ${t.orange500} 100%)`,
  color: "#fff",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
  boxShadow: `0 0 12px rgba(${dvSignatureOrange}, 0.22), 0 10px 28px rgba(0,0,0,0.35)`,
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
  border: dvModelCardBorder,
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
  border: dvModelCardBorder,
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
  border: `1.5px solid rgba(${dvSignatureOrange}, 0.42)`,
  boxShadow: `0 0 8px rgba(${dvSignatureOrange}, 0.2)`,
};

export const dvTextSecondary: CSSProperties = { color: t.textSecondary };
export const dvTextMuted: CSSProperties = { color: t.textMuted };
