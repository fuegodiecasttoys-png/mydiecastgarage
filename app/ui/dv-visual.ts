import type { CSSProperties } from "react";
import { t } from "./dv-tokens";

export const dvDisplayFont = `var(--dv-font-display), var(--dv-font-body), system-ui, sans-serif`;
export const dvBodyFont = `var(--dv-font-body), system-ui, sans-serif`;

export function shellBackground(): string {
  return "linear-gradient(180deg, #0B1018 0%, #090D14 32%, #07090D 62%, #050608 100%)";
}

export const dvOrangeBorderSubtle = "rgba(255,106,0,0.25)";
export const dvOrangeGlowSubtle = "rgba(255,106,0,0.10)";
export const dvIconOrangeMuted = "#FF8124";

export const dvQuickBorder = "rgba(255,106,0,0.18)";
export const dvQuickBoxShadow =
  "0 0 0 1px rgba(255,106,0,0.08), 0 10px 30px rgba(255,106,0,0.06)";

export const dvHeroBorder = "rgba(255,106,0,0.4)";
export const dvHeroShadow =
  "0 14px 36px rgba(0,0,0,0.42), 0 6px 16px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.32)";

export const dvPageShell: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
  padding: "20px 18px 32px",
  color: t.textPrimary,
  fontFamily: dvBodyFont,
  background: shellBackground(),
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
  border: "1px solid rgba(255,106,0,0.45)",
  background: `linear-gradient(180deg, ${t.orange400} 0%, ${t.orange500} 100%)`,
  color: "#fff",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
  boxShadow: `0 0 0 1px ${dvOrangeGlowSubtle}, 0 10px 28px rgba(0,0,0,0.35)`,
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
  border: `1px solid ${dvOrangeBorderSubtle}`,
  background: t.surface,
  boxShadow: `0 0 22px ${dvOrangeGlowSubtle}, 0 12px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)`,
  cursor: "pointer",
  textAlign: "left",
  color: t.textPrimary,
  WebkitTapHighlightColor: "transparent",
};

export const dvHeroRowCard: CSSProperties = {
  ...dvRowCardBase,
  padding: "18px 16px",
  border: `1px solid ${dvHeroBorder}`,
  background: t.surfaceElevated,
  boxShadow: dvHeroShadow,
};

export const dvQuickTile: CSSProperties = {
  ...dvRowCardBase,
  border: `1px solid ${dvQuickBorder}`,
  boxShadow: `${dvQuickBoxShadow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
};

export const dvListCard: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: 12,
  borderRadius: t.radiusLg,
  background: t.surface,
  border: `1px solid ${dvOrangeBorderSubtle}`,
  position: "relative",
  boxShadow: `0 0 18px ${dvOrangeGlowSubtle}, 0 10px 28px rgba(0,0,0,0.35)`,
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
  border: `1px solid ${t.borderSubtle}`,
};

export const dvTextSecondary: CSSProperties = { color: t.textSecondary };
export const dvTextMuted: CSSProperties = { color: t.textMuted };
