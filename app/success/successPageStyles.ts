import type { CSSProperties } from "react";
import { t } from "../ui/dv-tokens";
import {
  dvBodyFont,
  dvDisplayFont,
  dvPrimaryButton,
} from "../ui/dv-visual";

export const successLabelStyle: CSSProperties = {
  fontFamily: dvDisplayFont,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: t.orange400,
  margin: "0 0 10px",
};

export const successTitleStyle: CSSProperties = {
  fontFamily: dvDisplayFont,
  color: t.textPrimary,
  fontSize: 26,
  fontWeight: 700,
  margin: "0 0 12px",
  lineHeight: 1.2,
};

export const successParagraphStyle: CSSProperties = {
  margin: 0,
  color: t.textSecondary,
  fontFamily: dvBodyFont,
  lineHeight: 1.6,
  fontSize: 15,
};

export const successMutedParagraphStyle: CSSProperties = {
  ...successParagraphStyle,
  color: t.textMuted,
  fontSize: 14,
  marginTop: 16,
};

export const successDetailCardStyle: CSSProperties = {
  borderRadius: t.radiusLg,
  border: `1px solid ${t.borderAccent}`,
  background: t.surfaceElevated,
  padding: "18px 16px",
  marginTop: 20,
  boxShadow:
    "0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
  textAlign: "left",
};

export const successAccentStrongStyle: CSSProperties = {
  color: t.orange300,
  fontWeight: 700,
};

export const successPrimaryLinkStyle: CSSProperties = {
  ...dvPrimaryButton,
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  boxSizing: "border-box",
  marginTop: 28,
};

export const successSecondaryLinkStyle: CSSProperties = {
  display: "block",
  marginTop: 14,
  fontFamily: dvBodyFont,
  fontSize: 14,
  fontWeight: 600,
  color: t.orange400,
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
};
