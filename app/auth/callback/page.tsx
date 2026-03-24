"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [message, setMessage] = useState("Finishing sign in...");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function finishAuth() {
      try {
        const code = searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setMessage("Error al iniciar sesión");
            return;
          }
        }

        router.replace("/");
      } catch {
        setMessage("Error inesperado");
      }
    }

    finishAuth();
  }, [router, searchParams]);

  return <div>{message}</div>;
}