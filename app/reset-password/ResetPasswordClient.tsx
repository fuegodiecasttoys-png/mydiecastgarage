"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { PASSWORD_RULES_SUMMARY, validateSignupPassword } from "@/app/lib/signupValidation";
import { t } from "@/app/ui/dv-tokens";
import {
  dvDisplayFont,
  dvInput,
  dvPrimaryButton,
  dvPrimaryButtonDisabled,
  shellBackground,
} from "@/app/ui/dv-visual";

function EyeOpenIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={12} cy={12} r={3} stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.5 21.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 1l22 22" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

const cardChrome: CSSProperties = {
  background: t.surface,
  border: `1px solid rgba(255,106,0,0.38)`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  borderRadius: t.radiusLg,
  boxSizing: "border-box",
};

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  const [sessionReady, setSessionReady] = useState(false);
  const [fatal, setFatal] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const passwordCheck = useMemo(() => validateSignupPassword(password), [password]);
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit =
    sessionReady &&
    !submitting &&
    passwordCheck.ok &&
    password === confirmPassword &&
    password.length > 0;

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function init() {
      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace("/reset-password");
          return;
        }
        const {
          data: { session: existing },
        } = await supabase.auth.getSession();
        if (existing) {
          router.replace("/reset-password");
          setSessionReady(true);
          setBusy(false);
          return;
        }
        setFatal(
          error.message.toLowerCase().includes("expired") || error.message.toLowerCase().includes("invalid")
            ? "This reset link is invalid or has expired."
            : error.message
        );
        setBusy(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setBusy(false);
      if (session) {
        setSessionReady(true);
        return;
      }
      setFatal("This reset link is invalid or has expired. Request a new one from the login page.");
    }

    void init();
  }, [router, searchParams]);

  async function handleUpdatePassword() {
    setBanner(null);
    if (!canSubmit) return;
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setBanner({ kind: "error", text: error.message || "Could not update password." });
      return;
    }
    setBanner({ kind: "success", text: "Password updated successfully." });
    window.setTimeout(() => {
      router.replace("/");
    }, 1200);
  }

  const shell: CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 16px 40px",
    color: t.textPrimary,
    fontFamily: `var(--dv-font-body), system-ui, sans-serif`,
    background: shellBackground(),
  };

  const label: CSSProperties = {
    display: "block",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    color: t.textMuted,
  };

  const inputBase: CSSProperties = {
    ...dvInput,
    minHeight: 50,
  };

  const inputPw: CSSProperties = {
    ...inputBase,
    padding: "12px 44px 12px 14px",
  };

  const toggleBtn: CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: t.textMuted,
    padding: 0,
    borderRadius: t.radiusMd,
  };

  const card: CSSProperties = {
    ...cardChrome,
    width: "100%",
    maxWidth: 440,
    margin: "0 auto",
    padding: "22px 20px 24px",
  };

  return (
    <div className="auth-experience" style={shell}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0 auto 16px",
              filter: "drop-shadow(0 0 18px rgba(255,106,0,0.15))",
            }}
          >
            <Image src="/logo.png" alt="My Diecast Garage" width={72} height={72} priority />
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: dvDisplayFont,
              fontSize: "clamp(1.35rem, 4vw, 1.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: t.textPrimary,
            }}
          >
            {fatal ? "Reset link" : "Set a new password"}
          </h1>
        </header>

        <div style={card}>
          {busy ? (
            <p style={{ margin: 0, fontSize: 14, color: t.textSecondary }}>Verifying link…</p>
          ) : fatal ? (
            <>
              <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.5, color: "rgba(248,113,113,0.95)" }}>{fatal}</p>
              <button type="button" onClick={() => router.push("/login")} style={dvPrimaryButton}>
                Back to log in
              </button>
            </>
          ) : (
            <>
              <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.5, color: t.textSecondary }}>
                Choose a strong password. You’ll stay signed in and go to your garage when you’re done.
              </p>
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <label htmlFor="reset-pw" style={label}>
                    New password
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      id="reset-pw"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={inputPw}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      style={toggleBtn}
                    >
                      {showPw ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: t.textMuted }}>{PASSWORD_RULES_SUMMARY}</p>
                  {password.length > 0 && !passwordCheck.ok ? (
                    <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: "rgba(248,113,113,0.95)" }}>
                      {passwordCheck.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="reset-pw2" style={label}>
                    Confirm new password
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      id="reset-pw2"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={inputPw}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                      style={toggleBtn}
                    >
                      {showConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                  {mismatch ? (
                    <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: "rgba(248,113,113,0.95)" }}>
                      Passwords do not match
                    </p>
                  ) : null}
                </div>
                {banner ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.45,
                      color: banner.kind === "error" ? "rgba(248,113,113,0.95)" : "rgba(74,222,128,0.95)",
                    }}
                  >
                    {banner.text}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => void handleUpdatePassword()}
                  style={!canSubmit ? dvPrimaryButtonDisabled : dvPrimaryButton}
                >
                  {submitting ? "Updating…" : "Update password"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
