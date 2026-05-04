"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
    <main className="min-h-screen bg-[#020617] text-white px-5 py-12">
      <div className="mx-auto max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
            My Diecast Garage
          </p>
          <h1 className="text-3xl font-bold leading-tight">Pago exitoso</h1>
          <p className="text-base text-gray-300">
            Tu pago en My Diecast Garage fue procesado correctamente.
          </p>
        </div>

        <p className="text-sm leading-relaxed text-gray-400">
          Tu acceso Pro o tus créditos de escaneo deberían reflejarse en tu cuenta en unos segundos.
        </p>

        {(showPro || expiresLabel || scansLabel) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-gray-200 space-y-3">
            {showPro ? (
              <p className="font-semibold text-white">Tu plan Pro está activo</p>
            ) : null}
            {expiresLabel ? (
              <p>
                Tu acceso vence o se renueva el:{" "}
                <span className="font-medium text-orange-200">{expiresLabel}</span>
              </p>
            ) : null}
            {scansLabel ? (
              <p>
                Escaneos extra agregados:{" "}
                <span className="font-medium text-orange-200">{scansLabel}</span>
              </p>
            ) : null}
          </div>
        )}

        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 py-4 text-base font-bold text-black no-underline transition hover:bg-orange-400"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}

function SuccessFallback() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-5 py-12">
      <div className="mx-auto max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
            My Diecast Garage
          </p>
          <h1 className="text-3xl font-bold leading-tight">Pago exitoso</h1>
          <p className="text-sm text-gray-400">Cargando…</p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
