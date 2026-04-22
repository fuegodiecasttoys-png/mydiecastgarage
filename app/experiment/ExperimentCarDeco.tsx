"use client";

/** Superdeportivo moderno, tonos oscuros (Porsche 911, vista lateral) — Unsplash, solo /experiment. */
const CAR_SRC =
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=85&auto=format&fit=crop";

const CAR_FILTER =
  "brightness(0.4) contrast(1.1) saturate(0.6) grayscale(0.3) sepia(0.2)";

const CAR_MASK = "linear-gradient(to left, black 30%, transparent 85%)";

/**
 * Sombra elegante al fondo de “My Garage”: poco protagonismo, bajo en la pila, sin interacción.
 */
export function ExperimentCarDeco() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: -10,
        width: "50%",
        maxWidth: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity: 0.12,
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
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "100% 50%",
          filter: CAR_FILTER,
        }}
      />
    </div>
  );
}
