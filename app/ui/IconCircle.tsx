"use client";

import type { ReactNode } from "react";
import { t } from "./dv-tokens";
import { dvOrangeBorderSubtle, dvOrangeGlowSubtle } from "./dv-visual";

export type IconCircleVariant =
  | "accent"
  | "neutral"
  | "muted"
  | "orangeSubtle"
  | "orangeQuick";

export function IconCircle({
  children,
  variant,
}: {
  children: ReactNode;
  variant: IconCircleVariant;
}) {
  const ring =
    variant === "accent"
      ? {
          border: `1px solid ${t.borderMedium}`,
          bg: `linear-gradient(160deg, ${t.surfaceElevated} 0%, ${t.surface} 100%)`,
          glow: "0 8px 22px rgba(0,0,0,0.42)",
        }
      : variant === "orangeSubtle"
        ? {
            border: `1px solid ${dvOrangeBorderSubtle}`,
            bg: `linear-gradient(165deg, ${t.surfaceElevated} 0%, ${t.surface} 100%)`,
            glow: `0 0 22px ${dvOrangeGlowSubtle}`,
          }
        : variant === "orangeQuick"
          ? {
              border: "1px solid rgba(255,106,0,0.14)",
              bg: `linear-gradient(165deg, rgba(255,106,0,0.07) 0%, rgba(18,23,34,0.92) 42%, ${t.surface} 100%)`,
              glow: "0 0 18px rgba(255,106,0,0.05)",
            }
          : variant === "muted"
            ? {
                border: `1px dashed ${t.borderMedium}`,
                bg: t.bgSecondary,
                glow: "none",
              }
            : {
                border: `1px solid ${t.borderSubtle}`,
                bg: `linear-gradient(165deg, ${t.surfaceElevated} 0%, ${t.surface} 100%)`,
                glow: "0 8px 22px rgba(0,0,0,0.35)",
              };

  return (
    <div
      aria-hidden
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        background: ring.bg,
        border: ring.border,
        boxShadow: `${ring.glow === "none" ? "" : `${ring.glow}, `}inset 0 1px 0 rgba(255,255,255,0.06)`,
        fontSize: 22,
      }}
    >
      {children}
    </div>
  );
}
