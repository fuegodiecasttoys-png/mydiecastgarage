"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { t } from "../ui/dv-tokens";
import { dvAppPageShell, dvBodyFont, dvDashboardInner } from "../ui/dv-visual";
import {
  successAccentStrongStyle,
  successDetailCardStyle,
  successLabelStyle,
  successMutedParagraphStyle,
  successParagraphStyle,
  successPrimaryLinkStyle,
  successTitleStyle,
} from "./successPageStyles";

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
          <p style={successLabelStyle}>My Diecast Garage</p>
          <h1 style={successTitleStyle}>Pago exitoso</h1>
          <p style={successParagraphStyle}>
            Tu pago en My Diecast Garage fue procesado correctamente.
          </p>
          <p style={successMutedParagraphStyle}>
            Tu acceso Pro o tus créditos de escaneo deberían reflejarse en tu cuenta en unos
            segundos.
          </p>
        </div>

        {showPro || expiresLabel || scansLabel ? (
          <div style={successDetailCardStyle}>
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
                  <span style={successAccentStrongStyle}>{expiresLabel}</span>
                </p>
              ) : null}
              {scansLabel ? (
                <p style={{ margin: 0 }}>
                  Escaneos extra agregados:{" "}
                  <span style={successAccentStrongStyle}>{scansLabel}</span>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <Link href="/" style={successPrimaryLinkStyle}>
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
        <p style={successLabelStyle}>My Diecast Garage</p>
        <h1 style={successTitleStyle}>Pago exitoso</h1>
        <p style={successMutedParagraphStyle}>Cargando…</p>
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
