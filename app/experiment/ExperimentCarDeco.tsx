"use client";

/** Superdeportivo — referencia sutil; /experiment. */
const CAR_SRC =
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=85&auto=format&fit=crop";

/** Blur leve + oscurecido: atmósfera, no objeto. */
const CAR_FILTER =
  "blur(1.5px) brightness(0.35) contrast(1.05) saturate(0.5) grayscale(0.4)";

const CAR_MASK = "linear-gradient(to left, black 20%, transparent 90%)";

/**
 * Capa de “aire” bajo el contenido: muy tenue, sin clics, z-index bajo.
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
        opacity: 0.08,
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
