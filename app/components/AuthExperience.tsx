"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import {
  isValidUsernameFormat,
  normalizeUsernameInput,
  USERNAME_PUBLIC_RULES,
} from "../lib/profileUsername";
import {
  fetchUsernameAvailable,
  PASSWORD_RULES_SUMMARY,
  validateSignupPassword,
} from "../lib/signupValidation";
import { t } from "../ui/dv-tokens";
import {
  dvDisplayFont,
  dvInput,
  dvPrimaryButton,
  dvPrimaryButtonDisabled,
  shellBackground,
} from "../ui/dv-visual";

const USERNAME_DEBOUNCE_MS = 450;

type Tab = "login" | "signup";

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

const benefits = [
  { title: "Track every model", body: "Packed or loose — your garage stays organized." },
  { title: "Build your wishlist & highlight favorites", body: "Grails and gaps, all in one place." },
  { title: "View collector garages", body: "Friends see your shelves read-only by @username." },
] as const;

/** Same chrome as benefit cards — shared background, border, shadow, radius. */
const unifiedBenefitAuthCardChrome: CSSProperties = {
  background: t.surface,
  border: `1px solid rgba(255,106,0,0.24)`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  borderRadius: t.radiusLg,
  boxSizing: "border-box",
};

export function AuthExperience({ initialTab }: { initialTab: Tab }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialTab);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  const [usernameInUse, setUsernameInUse] = useState<boolean | null>(null);
  const [usernameCheckPending, setUsernameCheckPending] = useState(false);
  const [usernameRpcError, setUsernameRpcError] = useState<string | null>(null);

  const normalizedUsername = useMemo(() => normalizeUsernameInput(username), [username]);
  const usernameFormatOk =
    normalizedUsername.length === 0 ? null : isValidUsernameFormat(normalizedUsername);
  const passwordCheck = useMemo(() => validateSignupPassword(password), [password]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setLoginError(null);
    setBanner(null);
  }, [tab]);

  useEffect(() => {
    if (tab !== "signup") {
      setConfirmPassword("");
      setShowSignupPassword(false);
      setShowConfirmPassword(false);
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== "signup") return;
    if (!usernameFormatOk) {
      setUsernameInUse(null);
      setUsernameRpcError(null);
      setUsernameCheckPending(false);
      return;
    }

    setUsernameCheckPending(true);
    setUsernameRpcError(null);
    const handle = window.setTimeout(async () => {
      const r = await fetchUsernameAvailable(supabase, normalizedUsername);
      setUsernameCheckPending(false);
      if (!r.ok) {
        setUsernameInUse(null);
        setUsernameRpcError(r.message);
        return;
      }
      setUsernameRpcError(null);
      setUsernameInUse(r.available ? false : true);
    }, USERNAME_DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [tab, normalizedUsername, usernameFormatOk]);

  async function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();
    setLoginError(null);
    if (!cleanEmail || !password) {
      setLoginError("Enter your email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    setLoading(false);
    if (error) {
      setLoginError(error.message);
      return;
    }
    router.push("/");
  }

  async function handleSignup() {
    setBanner(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = normalizeUsernameInput(username);

    if (!cleanEmail || !cleanUsername || !password) {
      setBanner({ kind: "error", text: "Fill in email, username, and password." });
      return;
    }

    const pwd = validateSignupPassword(password);
    if (!pwd.ok) {
      setBanner({ kind: "error", text: pwd.message });
      return;
    }

    if (!isValidUsernameFormat(cleanUsername)) {
      setBanner({ kind: "error", text: "Username unavailable" });
      return;
    }

    if (password !== confirmPassword) {
      setBanner({ kind: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const avail = await fetchUsernameAvailable(supabase, cleanUsername);
      if (!avail.ok) {
        setBanner({ kind: "error", text: avail.message });
        return;
      }
      if (!avail.available) {
        setBanner({ kind: "error", text: "Username already used" });
        return;
      }

      const availAgain = await fetchUsernameAvailable(supabase, cleanUsername);
      if (!availAgain.ok) {
        setBanner({ kind: "error", text: availAgain.message });
        return;
      }
      if (!availAgain.available) {
        setBanner({ kind: "error", text: "Username already used" });
        return;
      }

      const { data: signData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: "https://www.mydiecastgarage.app/auth/callback",
          data: {
            username: cleanUsername,
            name: cleanUsername,
            last_name: "",
          },
        },
      });

      if (signUpError) {
        setBanner({
          kind: "error",
          text: signUpError.message.includes("already registered")
            ? "This email is already registered."
            : signUpError.message,
        });
        return;
      }

      if (!signData.user) {
        setBanner({ kind: "error", text: "Could not create account. Please try again." });
        return;
      }

      if (signData.session) {
        const { error: profErr } = await supabase.from("profiles").upsert(
          {
            user_id: signData.user.id,
            username: cleanUsername,
            name: cleanUsername,
          },
          { onConflict: "user_id" }
        );

        if (profErr) {
          const msg =
            profErr.code === "23505"
              ? "Username already used"
              : profErr.message || "Could not save profile.";
          setBanner({ kind: "error", text: msg });
          await supabase.auth.signOut();
          return;
        }

        router.push("/");
        return;
      }

      setBanner({
        kind: "info",
        text: "Check your email to confirm your account, then sign in.",
      });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  const usernameLiveMessage =
    tab !== "signup" || normalizedUsername.length === 0
      ? null
      : usernameFormatOk === false
        ? "Username unavailable"
        : usernameRpcError
          ? usernameRpcError
          : usernameCheckPending
            ? "Checking username…"
            : usernameInUse === true
              ? "Username already used"
              : usernameInUse === false
                ? `Will save as: ${normalizedUsername}`
                : null;

  const usernameLiveColor =
    normalizedUsername.length === 0
      ? t.textMuted
      : usernameFormatOk === false || usernameInUse === true || usernameRpcError
        ? "rgba(248,113,113,0.95)"
        : "rgba(74,222,128,0.9)";

  const passwordsMismatchSignup = confirmPassword.length > 0 && password !== confirmPassword;

  /** Used only on the Sign up tab (Create account). */
  const signupCreateDisabled =
    loading ||
    !email.trim() ||
    !normalizedUsername ||
    usernameFormatOk !== true ||
    usernameInUse === true ||
    usernameCheckPending ||
    !!usernameRpcError ||
    !passwordCheck.ok ||
    password !== confirmPassword;

  const shell: CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 16px 40px",
    color: t.textPrimary,
    fontFamily: `var(--dv-font-body), system-ui, sans-serif`,
    background: shellBackground(),
  };

  const card: CSSProperties = {
    ...unifiedBenefitAuthCardChrome,
    width: "100%",
    maxWidth: 440,
    margin: "0 auto",
    padding: "22px 20px 24px",
  };

  const tabBtn = (active: boolean): CSSProperties => ({
    flex: 1,
    padding: "12px 10px",
    borderRadius: 14,
    border: active ? `1px solid rgba(255,106,0,0.45)` : `1px solid ${t.borderSubtle}`,
    background: active ? "rgba(255,106,0,0.12)" : "rgba(255,255,255,0.03)",
    color: active ? t.textPrimary : t.textSecondary,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  });

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

  const inputPasswordWithToggle: CSSProperties = {
    ...inputBase,
    padding: "12px 44px 12px 14px",
  };

  const passwordToggleBtn: CSSProperties = {
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

  return (
    <div style={shell}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Hero */}
        <header style={{ textAlign: "center", marginBottom: 0, width: "100%", padding: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto 18px",
              padding: 0,
              boxSizing: "border-box",
              filter: "drop-shadow(0 0 18px rgba(255,106,0,0.15))",
            }}
          >
            <Image
              src="/logo.png"
              alt="My Diecast Garage"
              width={88}
              height={88}
              priority
              style={{
                display: "block",
                height: "auto",
                width: "auto",
                maxWidth: "100%",
                margin: 0,
              }}
            />
          </div>
          <h1
            style={{
              margin: "0 0 16px",
              fontFamily: dvDisplayFont,
              fontSize: "clamp(1.45rem, 4.5vw, 1.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              color: t.textPrimary,
            }}
          >
            Build your diecast garage
          </h1>
        </header>

        {/* Benefits — above auth; centered for mobile scan */}
        <section
          style={{
            width: "100%",
            maxWidth: 440,
            margin: "0 auto 12px",
            padding: 0,
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 auto 14px",
              maxWidth: 360,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: t.textMuted,
              textAlign: "center",
            }}
          >
            Why collectors use it
          </p>
          <div style={{ display: "grid", gap: 8, width: "100%" }}>
            {benefits.map((b) => (
              <div
                key={b.title}
                style={{
                  ...unifiedBenefitAuthCardChrome,
                  padding: "12px 16px",
                  textAlign: "center",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    lineHeight: 1.22,
                    color: t.textPrimary,
                    textAlign: "center",
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    color: t.textSecondary,
                    lineHeight: 1.35,
                    textAlign: "center",
                  }}
                >
                  {b.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Auth card */}
        <div style={card}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button type="button" style={tabBtn(tab === "login")} onClick={() => setTab("login")}>
              Log in
            </button>
            <button type="button" style={tabBtn(tab === "signup")} onClick={() => setTab("signup")}>
              Sign up
            </button>
          </div>

          {tab === "login" ? (
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label htmlFor="auth-email" style={label}>
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputBase}
                />
              </div>
              <div>
                <label htmlFor="auth-login-password" style={label}>
                  Password
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    id="auth-login-password"
                    type={showLoginPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputPasswordWithToggle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    style={passwordToggleBtn}
                  >
                    {showLoginPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>
              {loginError ? (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(248,113,113,0.95)", lineHeight: 1.4 }}>{loginError}</p>
              ) : null}
              <button
                type="button"
                disabled={loading}
                onClick={() => void handleLogin()}
                style={loading ? dvPrimaryButtonDisabled : dvPrimaryButton}
              >
                {loading ? "Signing in…" : "Enter the garage"}
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label htmlFor="auth-signup-email" style={label}>
                  Email
                </label>
                <input
                  id="auth-signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputBase}
                />
              </div>
              <div>
                <label htmlFor="auth-username" style={label}>
                  Username <span style={{ textTransform: "none", fontWeight: 500, color: t.textMuted }}>(public)</span>
                </label>
                <input
                  id="auth-username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. roberto_2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputBase}
                />
                <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.35, color: t.textMuted }}>{USERNAME_PUBLIC_RULES}</p>
                {usernameLiveMessage ? (
                  <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: usernameLiveColor }}>{usernameLiveMessage}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="auth-signup-password" style={label}>
                  Password
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    id="auth-signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputPasswordWithToggle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((v) => !v)}
                    aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    style={passwordToggleBtn}
                  >
                    {showSignupPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: t.textMuted }}>{PASSWORD_RULES_SUMMARY}</p>
                {password.length > 0 && !passwordCheck.ok ? (
                  <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: "rgba(248,113,113,0.95)" }}>{passwordCheck.message}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="auth-signup-password-confirm" style={label}>
                  Confirm password
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    id="auth-signup-password-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={inputPasswordWithToggle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    style={passwordToggleBtn}
                  >
                    {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {passwordsMismatchSignup ? (
                  <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: "rgba(248,113,113,0.95)" }}>
                    Passwords do not match
                  </p>
                ) : null}
              </div>
              {banner ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: banner.kind === "error" ? "rgba(248,113,113,0.95)" : t.orange300,
                  }}
                >
                  {banner.text}
                </p>
              ) : null}
              <button
                type="button"
                disabled={signupCreateDisabled}
                onClick={() => void handleSignup()}
                style={signupCreateDisabled ? dvPrimaryButtonDisabled : dvPrimaryButton}
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
