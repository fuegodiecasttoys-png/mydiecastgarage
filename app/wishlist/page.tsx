export default function Wishlist() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        padding: 20,
        color: "#fff",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <a
        href="/"
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          fontSize: 20,
          textDecoration: "none",
          color: "white",
          zIndex: 999,
        }}
      >
        🏠
      </a>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 20 }}>⭐ My Wishlist</h1>

        <div style={{ opacity: 0.6 }}>
          No items yet…
        </div>
      </div>
    </div>
  )
}
