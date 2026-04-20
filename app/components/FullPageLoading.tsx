"use client";

import { t } from "../ui/dv-tokens";
import { shellBackground } from "../ui/dv-visual";

export function FullPageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: shellBackground(),
        display: "grid",
        placeItems: "center",
        color: t.textPrimary,
        fontFamily: `var(--dv-font-body), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
        fontSize: 16,
        fontWeight: 600,
        opacity: 0.92,
        padding: 24,
        textAlign: "center",
      }}
    >
      {label}
    </div>
  );
}
