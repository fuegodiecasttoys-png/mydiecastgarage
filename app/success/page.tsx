"use client";

import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { t } from "../ui/dv-tokens";
import {
  dvAppPageShell,
  dvBodyFont,
  dvDashboardInner,
  dvDisplayFont,
  dvPrimaryButton,
} from "../ui/dv-visual";

const labelStyle: CSSProperties = {
  fontFamily: dvDisplayFont,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: t.orange400,
  margin: "0 0 10px",
};

const titleStyle: CSSProperties = {
  fontFamily: dvDisplayFont,
  color: t.textPrimary,
  fontSize: 26,
  fontWeight: 700,
  margin: "0 0 12px",
  lineHeight: 1.2,
};

const paragraphStyle: CSSProperties = {
  margin: 0,
  color: t.textSecondary,
  fontFamily: dvBodyFont,
  lineHeight: 1.6,
  fontSize: 15,
};

const mutedParagraphStyle: CSSProperties = {
  ...paragraphStyle,
  color: t.textMuted,
  fontSize: 14,
  marginTop: 16,
};

const detailCardStyle: CSSProperties = {
  borderRadius: t.radiusLg,
  border: `1px solid ${t.borderAccent}`,
  background: t.surfaceElevated,
  padding: "18px 16px",
  marginTop: 20,
  boxShadow: "0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
  textAlign: "left",
};

const accentStrongStyle: CSSProperties = {
  color: t.orange300,
  fontWeight: 700,
};

const linkButtonStyle: CSSProperties = {
  ...dvPrimaryButton,
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  boxSizing: "border-box",
  marginTop: 28,
};

function formatExpires(raw: string | null): string | null {
  if (!raw?.trim()) return null;
  const d = new Date(raw.trim());
  if (Number.isNaN(d.getTime())) return raw.trim();
  return d.toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan")?.trim().toLowerCase() ?? "";
  const expiresRaw = searchParams.get("expires");
  const scansRaw = searchParams.get("scans");

  const showPro = plan === "pro";
  const expiresLabel = formatExpires(expiresRaw);
  const scansLabel = scansRaw?.trim() ?? "";

  return (
    <div style={dvAppPageShell}>
      <div style={{ ...dvDashboardInner, textAlign: "center" }}>
        <div style={{ marginBottom: 8 }}>
          <p style={labelStyle}>My Diecast Garage</p>
          <h1 style={titleStyle}>Pago exitoso</h1>
          <p style={paragraphStyle}>
            Tu pago en My Diecast Garage fue procesado correctamente.
          </p>
          <p style={mutedParagraphStyle}>
            Tu acceso Pro o tus créditos de escaneo deberían reflejarse en tu cuenta en unos
            segundos.
          </p>
        </div>

        {(showPro || expiresLabel || scansLabel) ? (
          <div style={detailCardStyle}>
            <div
              style={{
                fontFamily: dvBodyFont,
                fontSize: 14,
                color: t.textSecondary,
                lineHeight: 1.55,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {showPro ? (
                <p style={{ margin: 0, color: t.textPrimary, fontWeight: 700 }}>
                  Tu plan Pro está activo
                </p>
              ) : null}
              {expiresLabel ? (
                <p style={{ margin: 0 }}>
                  Tu acceso vence o se renueva el:{" "}
                  <span style={accentStrongStyle}>{expiresLabel}</span>
                </p>
              ) : null}
              {scansLabel ? (
                <p style={{ margin: 0 }}>
                  Escaneos extra agregados:{" "}
                  <span style={accentStrongStyle}>{scansLabel}</span>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <Link href="/" style={linkButtonStyle}>
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

function SuccessFallback() {
  return (
    <div style={dvAppPageShell}>
      <div style={{ ...dvDashboardInner, textAlign: "center" }}>
        <p style={labelStyle}>My Diecast Garage</p>
        <h1 style={titleStyle}>Pago exitoso</h1>
        <p style={mutedParagraphStyle}>Cargando…</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
