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
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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

  const showDetailCard = showPro || expiresLabel || scansLabel;

  return (
    <div style={dvAppPageShell}>
      <div style={{ ...dvDashboardInner, textAlign: "center" }}>
        <div style={{ marginBottom: 8 }}>
          <p style={successLabelStyle}>My Diecast Garage</p>
          <h1 style={successTitleStyle}>Payment successful</h1>
          <p style={successParagraphStyle}>Your payment was processed successfully.</p>
          <p style={{ ...successParagraphStyle, marginTop: 12 }}>
            Thank you for your purchase.
          </p>
          <p style={successMutedParagraphStyle}>
            Your Pro access or extra auto scan credits should appear in your account within a few
            seconds.
          </p>
        </div>

        {showDetailCard ? (
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
                  Your Pro plan is active.
                </p>
              ) : null}
              {expiresLabel ? (
                <p style={{ margin: 0 }}>
                  Your access renews on:{" "}
                  <span style={successAccentStrongStyle}>{expiresLabel}</span>
                </p>
              ) : null}
              {scansLabel ? (
                <p style={{ margin: 0 }}>
                  Extra auto scans added:{" "}
                  <span style={successAccentStrongStyle}>{scansLabel}</span>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <Link href="/" style={successPrimaryLinkStyle}>
          Back to Home
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
        <h1 style={successTitleStyle}>Payment successful</h1>
        <p style={successMutedParagraphStyle}>Loading...</p>
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
