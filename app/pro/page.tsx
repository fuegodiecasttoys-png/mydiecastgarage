"use client"

import { useRouter } from "next/navigation"

export default function ProPage() {
  const router = useRouter()

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#fff",
        padding: 20,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <button
        onClick={() => router.push("/mygarage")}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Back
      </button>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
        💎 Go Pro
      </h1>

      <p style={{ opacity: 0.7, marginBottom: 20 }}>
        Unlock premium features and level up your garage
      </p>

      <div
        style={{
          background: "linear-gradient(180deg, #171717 0%, #101010 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: 20,
        }}
      >
        <ul style={{ lineHeight: 1.8 }}>
          <li>⭐ Unlimited favorites</li>
          <li>📊 Export to Excel</li>
        </ul>

        <button
          style={{
            marginTop: 20,
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            background: "#facc15",
            border: "none",
            fontWeight: 800,
            cursor: "pointer",
            color: "#000",
          }}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}