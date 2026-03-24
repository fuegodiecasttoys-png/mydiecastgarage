"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.push("/mygarage");
      } else {
        router.push("/login");
      }
    }

    checkUser();
  }, [router]);

  return <div>Loading...</div>;
}