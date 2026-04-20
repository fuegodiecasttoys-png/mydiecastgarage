/**
 * Shared design tokens — same palette as `/experiment` (automotive / collector dark luxury).
 */
export const t = {
  bg: "#07090D",
  bgSecondary: "#0D1117",
  surface: "#121722",
  surfaceElevated: "#171D2A",
  borderSubtle: "rgba(255,255,255,0.08)",
  borderMedium: "rgba(255,255,255,0.14)",
  textPrimary: "#F5F7FA",
  textSecondary: "rgba(245,247,250,0.72)",
  textMuted: "rgba(245,247,250,0.48)",
  orange500: "#FF6A00",
  orange400: "#FF8124",
  orange300: "#FFA14D",
  orangeGlow: "rgba(255,106,0,0.28)",
  blue500: "#2D6BFF",
  blue400: "#5A8DFF",
  blueGlow: "rgba(45,107,255,0.18)",
  radiusXl: 28,
  radiusLg: 24,
  radiusMd: 20,
  spaceSection: 28,
  spaceBlock: 16,
  spaceTight: 12,
} as const;

export type DvTokens = typeof t;
