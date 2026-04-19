"use client"

export function FullPageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: 16,
        fontWeight: 600,
        opacity: 0.88,
        padding: 24,
        textAlign: "center",
      }}
    >
      {label}
    </div>
  )
}
