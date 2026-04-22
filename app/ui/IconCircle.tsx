"use client";

import type { ReactNode } from "react";
import { t } from "./dv-tokens";

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
          border: `1px solid ${t.borderAccent}`,
          bg: "rgba(255,255,255,0.04)",
          glow: "0 6px 16px rgba(0,0,0,0.4)",
        }
      : variant === "orangeSubtle"
        ? {
            border: `1px solid ${t.borderAccent}`,
            bg: "rgba(255,255,255,0.04)",
            glow: "0 4px 14px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)",
          }
        : variant === "orangeQuick"
          ? {
              border: `1px solid ${t.borderAccent}`,
              bg: "rgba(255,255,255,0.04)",
              glow: "0 4px 14px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)",
            }
          : variant === "muted"
            ? {
                border: `1px dashed ${t.borderMedium}`,
                bg: t.bgSecondary,
                glow: "none",
              }
            : {
                border: `1px solid ${t.borderSubtle}`,
                bg: "rgba(255,255,255,0.04)",
                glow: "0 6px 16px rgba(0,0,0,0.4)",
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
        boxShadow: `${ring.glow === "none" ? "" : `${ring.glow}, `}inset 0 1px 0 rgba(255,255,255,0.04)`,
        fontSize: 22,
      }}
    >
      {children}
    </div>
  );
}
