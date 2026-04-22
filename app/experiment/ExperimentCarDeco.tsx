"use client";

/** Superdeportivo moderno, tonos oscuros (Porsche 911, vista lateral) — Unsplash, solo /experiment. */
const CAR_SRC =
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=85&auto=format&fit=crop";

/**
 * Silueta de auto al fondo de “My Garage”: anclada abajo-derecha, baja en la jerarquía, sin capturar clicks.
 */
export function ExperimentCarDeco() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        top: 0,
        width: "60%",
        maxWidth: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity: 0.15,
        maskImage: "linear-gradient(to left, black 40%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 100%)",
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
          filter: "brightness(0.6) contrast(1.2)",
        }}
      />
    </div>
  );
}
