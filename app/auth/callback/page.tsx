export const dynamic = "force-dynamic";

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [message, setMessage] = useState("Finishing sign in...");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function finishAuth() {
      const code = searchParams.get("code");

      if (!code) {
        router.replace("/login");
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
        code
      );

      if (exchangeError) {
        alert(exchangeError.message);
        router.replace("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const user = userData.user;
      const meta = user.user_metadata ?? {};

      if (meta.username && meta.name && meta.last_name) {
        setMessage("Setting up your profile...");

        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            user_id: user.id,
            username: String(meta.username).trim().toLowerCase(),
            name: String(meta.name).trim(),
            last_name: String(meta.last_name).trim(),
          },
          {
            onConflict: "user_id",
          }
        );

        if (profileError) {
          alert(profileError.message);
          router.replace("/login");
          return;
        }
      }

      router.replace("/mygarage");
    }

    finishAuth();
  }, [router, searchParams]);

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
          maxWidth: 420,
          background: "rgba(20,20,20,0.88)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 28,
          padding: "32px 24px",
          textAlign: "center",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
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
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}