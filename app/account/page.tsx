"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FullPageLoading } from "../components/FullPageLoading";
import { AccentBadge } from "../ui/AccentBadge";
import { IconCircle } from "../ui/IconCircle";
import { isActiveProRow } from "../lib/fetchProfile";
import { supabase } from "../lib/supabaseClient";
import { t } from "../ui/dv-tokens";
import {
  dvAppPageShell,
  dvDashboardInner,
  dvDisplayFont,
  dvGhostButton,
  dvListCard,
  dvPrimaryButton,
  dvRowCardBase,
} from "../ui/dv-visual";

type ProfileRow = {
  username?: string | null;
  name?: string | null;
  last_name?: string | null;
  plan?: string | null;
  is_active?: boolean | null;
  monthly_ai_scans?: number | null;
  ai_credits?: number | null;
  monthly_captures?: number | null;
  pro_expires_at?: string | null;
};

const LIMIT = 50;

const chevronStyle = {
  fontSize: 20,
  fontWeight: 300,
  opacity: 0.85,
  marginLeft: 8,
  flexShrink: 0,
} as const;

function formatPlanExpires(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const d = new Date(raw.trim());
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function displayName(profile: ProfileRow | null): string {
  if (!profile) return "—";
  const parts = [profile.name, profile.last_name].filter(
    (x): x is string => typeof x === "string" && Boolean(x.trim())
  );
  return parts.length ? parts.join(" ") : "—";
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? null);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "username, name, last_name, plan, is_active, monthly_ai_scans, ai_credits, monthly_captures, pro_expires_at"
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        setLoadError(error.message);
        setProfile(null);
      } else {
        setProfile((data as ProfileRow) ?? null);
      }

      setLoading(false);
    }

    void run();
  }, [router]);

  if (loading) {
    return <FullPageLoading label="Loading account..." />;
  }

  const used = profile?.monthly_ai_scans ?? 0;
  const credits = profile?.ai_credits ?? 0;
  const left = Math.max(0, LIMIT - used) + credits;
  const monthlyCaptures = profile?.monthly_captures ?? 0;
  const expiresLabel = formatPlanExpires(profile?.pro_expires_at);
  const activePro = isActiveProRow(profile);
  const planLabel =
    profile?.plan === "pro" ? "Pro" : profile?.plan === "free" ? "Free" : profile?.plan ?? "—";

  const sectionCard = {
    ...dvListCard,
    flexDirection: "column" as const,
    alignItems: "stretch" as const,
    gap: 10,
    marginBottom: 12,
    cursor: "default",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: t.textMuted,
    marginBottom: 4,
  };

  const valueStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: t.textPrimary,
    lineHeight: 1.4,
    wordBreak: "break-word" as const,
  };

  return (
    <div style={dvAppPageShell}>
      <Link
        href="/"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 20,
          textDecoration: "none",
          color: t.textPrimary,
          zIndex: 10,
        }}
      >
        🏠
      </Link>

      <div style={dvDashboardInner}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <img
            src="/logo.png"
            alt="My Diecast Garage"
            style={{
              width: 120,
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />

          <h1
            style={{
              fontFamily: dvDisplayFont,
              fontSize: 28,
              margin: "14px 0 6px 0",
              fontWeight: 800,
              color: t.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            My Account
          </h1>
        </div>

        {loadError ? (
          <div
            style={{
              marginBottom: 12,
              padding: "12px 14px",
              borderRadius: t.radiusMd,
              border: "1px solid rgba(255,100,100,0.28)",
              background: "rgba(200, 60, 60, 0.1)",
              fontSize: 13,
              color: "rgba(255,200,200,0.92)",
            }}
          >
            {loadError}
          </div>
        ) : null}

        <div style={sectionCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconCircle variant="orangeSubtle">👤</IconCircle>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: t.textPrimary,
              }}
            >
              Account Info
            </div>
          </div>

          <div>
            <div style={labelStyle}>Email</div>
            <div style={valueStyle}>{email ?? "—"}</div>
          </div>

          <div>
            <div style={labelStyle}>Username</div>
            <div style={valueStyle}>
              {typeof profile?.username === "string" && profile.username.trim()
                ? profile.username
                : "—"}
            </div>
          </div>

          <div>
            <div style={labelStyle}>Name</div>
            <div style={valueStyle}>{displayName(profile)}</div>
          </div>
        </div>

        <div style={sectionCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconCircle variant="orangeSubtle">🚀</IconCircle>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: t.textPrimary,
              }}
            >
              Subscription
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ ...valueStyle, margin: 0 }}>
              Plan: <span style={{ color: t.orange400 }}>{planLabel}</span>
            </div>
            {activePro ? (
              <AccentBadge>Pro Active</AccentBadge>
            ) : (
              <AccentBadge muted>Free</AccentBadge>
            )}
          </div>

          {activePro ? (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: t.textSecondary,
                lineHeight: 1.45,
              }}
            >
              {expiresLabel
                ? `Renews on: ${expiresLabel}`
                : "No expiration date"}
            </p>
          ) : null}

          {!activePro ? (
  <button
    type="button"
    onClick={() => router.push("/pro")}
    style={{ ...dvPrimaryButton, marginTop: 4 }}
  >
    Upgrade to Pro
  </button>
) : (
  <button
  type="button"
  onClick={async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch("/api/stripe/customer-portal", {
      method: "POST",
      headers: {
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      },
    })

    const data = await res.json()

    if (!res.ok || !data?.url) {
      alert(data?.error ?? "Could not open subscription management.")
      return
    }

    window.location.href = data.url
  }}
  style={{ ...dvGhostButton, width: "100%", marginTop: 4 }}
>
  Manage subscription
</button>
)}
        </div>

        <div style={{ ...sectionCard, marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconCircle variant="orangeSubtle">📊</IconCircle>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: t.textPrimary,
              }}
            >
              Usage
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={valueStyle}>Scans used: {used} / {LIMIT}</div>
            <div style={valueStyle}>Extra scans: {credits}</div>
            <div style={valueStyle}>Scans left: {left}</div>
            <div style={valueStyle}>Monthly captures: {monthlyCaptures}</div>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 500,
              color: t.textMuted,
              lineHeight: 1.45,
            }}
          >
            {activePro
              ? "Need more? Buy extra scan packs anytime."
              : "Upgrade to Pro to unlock 50 model scans per month."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/pro?buy=scans")}
            style={{
              ...dvRowCardBase,
              marginTop: 4,
              marginBottom: 0,
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 800 }}>Buy more scans</span>
            <span style={{ ...chevronStyle, color: t.textMuted }} aria-hidden>
              ›
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}