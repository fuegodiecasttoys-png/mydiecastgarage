"use client";

import Image from "next/image";

const CAR_SRC =
  "https://images.unsplash.com/photo-1542362567-b07d54358753?w=800&q=80&auto=format&fit=crop";

/**
 * Photoreal car on the right of My Garage hero, masked and low contrast (reference look).
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
        width: "min(60%, 220px)",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
        borderRadius: "0 0 0 0",
        maskImage: "linear-gradient(90deg, transparent 0%, black 22%, black 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 22%, black 100%)",
        opacity: 0.55,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: 120,
        }}
      >
        <Image
          src={CAR_SRC}
          alt=""
          fill
          sizes="(max-width: 500px) 50vw, 220px"
          className="object-cover"
          style={{ objectPosition: "right center" }}
          priority={false}
        />
      </div>
    </div>
  );
}
