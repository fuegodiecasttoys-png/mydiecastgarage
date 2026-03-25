"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function handleAuth() {
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          alert(error.message);
          router.replace("/login");
          return;
        }

        router.replace("/app");
        return;
      }

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "signup" | "email" | "recovery" | "invite" | "magiclink" | "email_change",
        });

        if (error) {
          alert(error.message);
          router.replace("/login");
          return;
        }

        router.replace("/");
        return;
      }

      router.replace("/login");
    }

    handleAuth();
  }, [router, searchParams]);

  return <div>Logging you in...</div>;
}