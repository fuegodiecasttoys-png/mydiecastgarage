"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import {
  dvHeroRowCard,
  dvListCard,
  dvQuickTile,
  dvRowCardBase,
} from "./dv-visual";

export type CardVariant = "row" | "hero" | "quick" | "list";

const variantStyles: Record<CardVariant, CSSProperties> = {
  row: dvRowCardBase,
  hero: dvHeroRowCard,
  quick: dvQuickTile,
  list: dvListCard,
};

export function Card({
  variant,
  children,
  style,
  ...rest
}: {
  variant: CardVariant;
  children: ReactNode;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ ...variantStyles[variant], ...style }} {...rest}>
      {children}
    </div>
  );
}
