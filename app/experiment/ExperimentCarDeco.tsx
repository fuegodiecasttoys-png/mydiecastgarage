"use client";

const CAR_SRC =
  "https://images.unsplash.com/photo-1542362567-b07d54358753?w=800&q=80&auto=format&fit=crop";

/**
 * Dark car photo, right side — `img` keeps /experiment self-contained (no `next.config`).
 */
export function ExperimentCarDeco() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "min(58%, 210px)",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent 0%, black 20%, black 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 20%, black 100%)",
        opacity: 0.48,
      }}
    >
      <img
        src={CAR_SRC}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "right center",
        }}
      />
    </div>
  );
}
