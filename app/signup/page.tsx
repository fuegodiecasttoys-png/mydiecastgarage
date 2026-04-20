"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
import { useRouter } from "next/navigation";

const USERNAME_DEBOUNCE_MS = 450;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  /** null = not checked / error; true = username taken; false = free */
  const [usernameInUse, setUsernameInUse] = useState<boolean | null>(null);
  const [usernameCheckPending, setUsernameCheckPending] = useState(false);
  const [usernameRpcError, setUsernameRpcError] = useState<string | null>(null);
  const router = useRouter();

  const normalizedUsername = useMemo(() => normalizeUsernameInput(username), [username]);
  const usernameFormatOk =
    normalizedUsername.length === 0 ? null : isValidUsernameFormat(normalizedUsername);

  const passwordCheck = useMemo(() => validateSignupPassword(password), [password]);

  useEffect(() => {
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

    return () => {
      window.clearTimeout(handle);
    };
  }, [normalizedUsername, usernameFormatOk]);

  async function handleSignup() {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = normalizeUsernameInput(username);
    const cleanName = name.trim();
    const cleanLastName = lastName.trim();
    const displayName =
      [cleanName, cleanLastName].filter((s) => s.length > 0).join(" ").trim() || null;

    if (
      !cleanEmail ||
      !cleanUsername ||
      !cleanName ||
      !cleanLastName ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const pwd = validateSignupPassword(password);
    if (!pwd.ok) {
      alert(pwd.message);
      return;
    }

    if (!isValidUsernameFormat(cleanUsername)) {
      alert("Username unavailable");
      return;
    }

    setLoading(true);
    try {
      const avail = await fetchUsernameAvailable(supabase, cleanUsername);
      if (!avail.ok) {
        alert(avail.message);
        return;
      }
      if (!avail.available) {
        alert("Username already used");
        return;
      }

      const availAgain = await fetchUsernameAvailable(supabase, cleanUsername);
      if (!availAgain.ok) {
        alert(availAgain.message);
        return;
      }
      if (!availAgain.available) {
        alert("Username already used");
        return;
      }

      const { data: signData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: "https://www.mydiecastgarage.app/auth/callback",
          data: {
            username: cleanUsername,
            name: cleanName,
            last_name: cleanLastName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          alert("This email is already registered.");
        } else {
          alert(signUpError.message);
        }
        return;
      }

      if (!signData.user) {
        alert("Could not create account. Please try again.");
        return;
      }

      if (signData.session) {
        const { error: profErr } = await supabase.from("profiles").upsert(
          {
            user_id: signData.user.id,
            username: cleanUsername,
            name: displayName,
          },
          { onConflict: "user_id" }
        );

        if (profErr) {
          const msg =
            profErr.code === "23505"
              ? "Username already used"
              : profErr.message || "Could not save profile.";
          alert(msg);
          await supabase.auth.signOut();
          return;
        }

        router.push("/");
        return;
      }

      alert(
        "Check your email to confirm your account. You can sign in after confirming."
      );
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  const usernameLiveMessage =
    normalizedUsername.length === 0
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
      ? "rgba(255,255,255,0.45)"
      : usernameFormatOk === false || usernameInUse === true || usernameRpcError
        ? "rgba(248,113,113,0.95)"
        : "rgba(74,222,128,0.9)";

  const passwordBlocksSubmit = password.length > 0 && !passwordCheck.ok;

  const usernameBlocksSubmit =
    normalizedUsername.length > 0 &&
    (usernameFormatOk !== true ||
      usernameInUse === true ||
      usernameCheckPending ||
      !!usernameRpcError);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, rgba(32,110,255,0.14) 0%, rgba(11,11,11,1) 28%, rgba(8,8,8,1) 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "rgba(20,20,20,0.88)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 28,
          padding: "32px 24px",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 110,
              height: 110,
              margin: "0 auto 18px",
              borderRadius: 20,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              placeItems: "center",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.35), 0 0 30px rgba(0,153,255,0.12)",
            }}
          >
            <Image
              src="/logo.png"
              alt="My Diecast Garage logo"
              width={95}
              height={95}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Create account
          </h1>

          <p
            style={{
              marginTop: 12,
              marginBottom: 28,
              fontSize: 14,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.68)",
            }}
          >
            Join My Diecast Garage and start organizing your collection.
            <br />
            Track packed and loose cars in one place.
            <br />
            Build your garage, your way.
          </p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="username" style={labelStyle}>
              Username <span style={{ fontWeight: 400, opacity: 0.75 }}>(public)</span>
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
            <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.35, color: "rgba(255,255,255,0.45)" }}>
              {USERNAME_PUBLIC_RULES}
            </p>
            {usernameLiveMessage ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: usernameLiveColor }}>
                {usernameLiveMessage}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="name" style={labelStyle}>
              First name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="lastName" style={labelStyle}>
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.35, color: "rgba(255,255,255,0.45)" }}>
              {PASSWORD_RULES_SUMMARY}
            </p>
            {password.length > 0 && !passwordCheck.ok ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600, color: "rgba(248,113,113,0.95)" }}>
                {passwordCheck.message}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            marginBottom: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={toggleButtonStyle}
          >
            {showPassword ? "Hide password" : "Show password"}
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={toggleButtonStyle}
          >
            {showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => void handleSignup()}
          disabled={loading || usernameBlocksSubmit || passwordBlocksSubmit}
          style={{
            width: "100%",
            height: 54,
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(180deg, #37b8ff 0%, #1583ff 100%)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 12px 30px rgba(21,131,255,0.35)",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: 18,
            marginBottom: 0,
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#37b8ff",
              fontWeight: 700,
              textDecoration: "none",
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid rgba(55,184,255,0.3)",
              background: "rgba(55,184,255,0.08)",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 600,
  color: "rgba(255,255,255,0.78)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: 54,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "#ffffff",
  padding: "0 16px",
  outline: "none",
  fontSize: 15,
  boxSizing: "border-box",
};

const toggleButtonStyle: CSSProperties = {
  fontSize: 12,
  color: "#4da6ff",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};
