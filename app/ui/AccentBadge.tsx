"use client";

import type { CSSProperties, ReactNode } from "react";
import { t } from "./dv-tokens";

export function AccentBadge({
  children,
  style,
  muted,
}: {
  children: ReactNode;
  style?: CSSProperties;
  muted?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 11px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        border: muted
          ? `1px solid ${t.borderSubtle}`
          : `1px solid ${t.borderAccent}`,
        background: muted
          ? "rgba(255,255,255,0.04)"
          : "linear-gradient(90deg, rgba(255,122,24,0.12), rgba(255,122,24,0.07))",
        color: muted ? t.textMuted : t.orange300,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
