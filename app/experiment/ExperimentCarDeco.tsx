"use client";

const CAR_SRC =
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=85&auto=format&fit=crop";

const CAR_FILTER =
  "brightness(0.5) contrast(1.12) saturate(0.65) grayscale(0.2) blur(0.6px)";

const CAR_MASK = "linear-gradient(to left, black 40%, transparent 85%)";

const OVERLAY =
  "linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent)";

/**
 * Capa de coche al fondo de “My Garage”: legible, integrada, sin robar clics.
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
        width: "55%",
        maxWidth: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity: 0.17,
        maskImage: CAR_MASK,
        WebkitMaskImage: CAR_MASK,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        borderRadius: "inherit",
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
          objectPosition: "100% 50%",
          filter: CAR_FILTER,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: OVERLAY,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
