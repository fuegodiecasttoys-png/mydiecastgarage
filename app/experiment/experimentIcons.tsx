/**
 * Icon paths adapted from Lucide (ISC, https://lucide.dev) — /experiment only.
 */
"use client";

import type { SVGProps } from "react";

const SW = 1.5;

const strk = (c: string) => ({
  fill: "none" as const,
  stroke: c,
  strokeWidth: SW,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export type ExpIconProps = SVGProps<SVGSVGElement> & { color: string; size?: number };

function z(n?: number) {
  return n ?? 24;
}

/** Add Packed */
export function ExpIconPackage({ color, size, ...p }: ExpIconProps) {
  const s = z(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden {...p} {...strk(color)}>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <path d="m7.5 4.27 9 5.15" />
    </svg>
  );
}

/** Add Loose */
export function ExpIconCar({ color, size, ...p }: ExpIconProps) {
  const s = z(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden {...p} {...strk(color)}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" fill="none" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" fill="none" />
    </svg>
  );
}

/** My Garage (home with door) */
export function ExpIconHouse({ color, size, ...p }: ExpIconProps) {
  const s = z(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden {...p} {...strk(color)}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

/** Favorites — outline star (same stroke system as other list icons) */
export function ExpIconStar({ color, size, ...p }: ExpIconProps) {
  const s = z(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden {...p} {...strk(color)}>
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

/** Wishlist */
export function ExpIconHeart({ color, size, ...p }: ExpIconProps) {
  const s = z(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden {...p} {...strk(color)}>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

/** Add Friends */
export function ExpIconUsers({ color, size, ...p }: ExpIconProps) {
  const s = z(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden {...p} {...strk(color)}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" fill="none" />
    </svg>
  );
}

/** How To (photos) */
export function ExpIconCamera({ color, size, ...p }: ExpIconProps) {
  const s = z(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden {...p} {...strk(color)}>
      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
      <circle cx="12" cy="13" r="3" fill="none" />
    </svg>
  );
}
