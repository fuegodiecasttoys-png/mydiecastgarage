import {
  experimentAppBackground,
  experimentHeroSubline,
  experimentPagePaddingX,
  experimentPagePaddingY,
  experimentRadiusFeature,
  experimentTextStrong,
} from "./experimentHeroStyle";

const chev = "›" as const;

/**
 * Página de prueba aislada: bloque izquierdo centrado en vertical con top/translateY, no con flex.
 */
export function ExperimentGarageTestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background: experimentAppBackground,
        color: experimentTextStrong,
        padding: `${experimentPagePaddingY}px ${experimentPagePaddingX}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      }}
    >
      <div
        className="card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 500,
          height: 130,
          borderRadius: experimentRadiusFeature,
          overflow: "hidden",
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #111827 0%, #0b1017 100%)",
          border: "1px solid rgba(255, 140, 0, 0.12)",
        }}
      >
        <div
          className="leftBlock"
          style={{
            position: "absolute",
            top: "50%",
            left: 20,
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            boxSizing: "border-box",
          }}
        >
          <div
            className="title"
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 8,
              color: experimentTextStrong,
            }}
          >
            My Garage
          </div>
          <div
            className="badge"
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
              marginBottom: 7,
              padding: "4px 12px",
              borderRadius: 999,
              color: "#FFB85C",
              background: "linear-gradient(180deg, rgba(40, 28, 8, 0.65) 0%, rgba(25, 16, 4, 0.8) 100%)",
              border: "1px solid rgba(255, 197, 120, 0.3)",
            }}
          >
            No models yet
          </div>
          <div
            className="subline"
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.32,
              letterSpacing: "0.01em",
              color: experimentHeroSubline,
            }}
          >
            View your collection
          </div>
        </div>
        <span
          className="chevron"
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 30,
            fontWeight: 300,
            lineHeight: 1,
            color: "rgba(255, 184, 92, 0.95)",
          }}
          aria-hidden
        >
          {chev}
        </span>
      </div>
    </div>
  );
}
