/**
 * /experiment-only: My Garage hero card (does not affect production /).
 */

export const experimentHeroBoxShadow =
  "0 0 0 1px rgba(255,122,24,0.22), 0 6px 18px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)";

export const experimentHeroBoxShadowHover =
  "0 0 0 1px rgba(255,122,24,0.3), 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)";

export const experimentHeroBackground =
  "linear-gradient(180deg, #161B24 0%, #0F1218 100%)";

export const experimentHeroBorder = "1px solid rgba(255,122,24,0.28)";

export const experimentHeroBadge = {
  background: "rgba(255,122,24,0.12)",
  border: "1px solid rgba(255,122,24,0.25)",
  color: "#FF9A3D" as const,
} as const;

export const experimentHeroIconBorder = "1px solid rgba(255,122,24,0.22)";
