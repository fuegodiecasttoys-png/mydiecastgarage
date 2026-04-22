"use client";

/**
 * Dark sports-car side silhouette for My Garage hero (right side, low contrast, premium mood).
 */
export function ExperimentHeroCarDeco() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "min(58%, 200px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: 4,
        pointerEvents: "none",
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 100%)",
      }}
    >
      <svg
        viewBox="0 0 220 100"
        preserveAspectRatio="xMaxYMid meet"
        aria-hidden
        style={{
          width: "100%",
          height: "86%",
          maxHeight: 104,
          opacity: 0.4,
        }}
      >
        <defs>
          <linearGradient id="exCarBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a101a" stopOpacity="0" />
            <stop offset="28%" stopColor="#182232" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0e1420" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="exCarWindow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c2838" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0a0e16" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Body + cabin */}
        <path
          fill="url(#exCarBody)"
          d="M12 78 L 24 48 L 52 40 L 118 36 L 178 40 L 208 50 L 218 68 L 218 80 L 202 84 L 198 74 L 180 72 L 174 82 L 150 84 L 142 72 L 110 70 L 102 80 L 78 82 L 70 70 L 44 72 L 38 82 L 20 80 Z"
        />
        <path
          fill="url(#exCarWindow)"
          d="M 124 40 L 168 44 L 196 56 L 188 50 L 155 45 Z"
        />
        {/* wheels */}
        <ellipse cx="52" cy="80" rx="10" ry="4" fill="#0a0e16" opacity="0.8" />
        <ellipse cx="52" cy="80" rx="4" ry="1.2" fill="#1a2a3a" opacity="0.5" />
        <ellipse cx="158" cy="80" rx="9" ry="3.5" fill="#0a0e16" opacity="0.8" />
        <ellipse cx="158" cy="80" rx="3.5" ry="1" fill="#1a2a3a" opacity="0.5" />
        {/* underbody line */}
        <path
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.4"
          d="M 14 75 Q 100 64 210 70"
        />
      </svg>
    </div>
  );
}
