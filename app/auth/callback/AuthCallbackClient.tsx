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

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      router.replace("/mygarage");
    }

    handleAuth();
  }, [router, searchParams]);

  return <div>Logging you in...</div>;
}