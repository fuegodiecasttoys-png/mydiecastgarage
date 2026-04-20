"use client";

import type { CSSProperties, ReactNode } from "react";
import { dvDisplayFont } from "./dv-visual";
import { t } from "./dv-tokens";

export function SectionTitle({
  children,
  as: Tag = "h2",
  style,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  style?: CSSProperties;
}) {
  return (
    <Tag
      style={{
        margin: 0,
        fontFamily: dvDisplayFont,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: t.textPrimary,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
