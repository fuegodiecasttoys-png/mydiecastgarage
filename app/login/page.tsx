"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "../lib/supabaseServer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email for your login link.");
  }

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
          maxWidth: 430,
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
              width: 72,
              height: 72,
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
              alt="Diecast Vault logo"
              width={42}
              height={42}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Diecast Vault
          </h1>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              fontSize: 15,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.68)",
            }}
          >
            A better way to manage your diecast collection.
          </p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
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
            }}
          />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            color: "rgba(255,255,255,0.74)",
            marginBottom: 20,
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            style={{
              width: 16,
              height: 16,
              accentColor: "#1ea7ff",
              cursor: "pointer",
            }}
          />
          Keep me logged in
        </label>

        <button
          onClick={handleLogin}
          disabled={loading}
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
          {loading ? "Sending link..." : "Enter the garage"}
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
  Don&apos;t have an account?{" "}
  <a
    href="/signup"
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
    Sign up
  </a>
</p>

        
      </div>
    </div>
  );
}
