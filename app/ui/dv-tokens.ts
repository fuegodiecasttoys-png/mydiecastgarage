/**
 * Shared design tokens — premium automotive / collector dark UI.
 */
export const t = {
  bg: "#07090D",
  bgSecondary: "#0B0F17",
  /** Card / panel — primary */
  surface: "#101725",
  /** Slightly alternate surface */
  surfaceElevated: "#131C2C",
  borderSubtle: "rgba(255,255,255,0.08)",
  borderMedium: "rgba(255,255,255,0.12)",
  borderAccent: "rgba(255,122,24,0.18)",
  textPrimary: "#F5F7FA",
  textSecondary: "rgba(245,247,250,0.72)",
  textMuted: "rgba(245,247,250,0.52)",
  orange500: "#FF7A18",
  orange400: "#FF9A3D",
  orange300: "#FFB870",
  orangeGlow: "rgba(255,122,24,0.14)",
  /** Reserved — avoid blue in UI; maps to neutral accent if referenced */
  blue500: "rgba(245,247,250,0.35)",
  blue400: "rgba(245,247,250,0.28)",
  blueGlow: "rgba(0,0,0,0)",
  radiusXl: 28,
  radiusLg: 24,
  radiusMd: 20,
  spaceSection: 28,
  spaceBlock: 16,
  spaceTight: 12,
} as const;

export type DvTokens = typeof t;
