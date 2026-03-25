"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      // 👉 Si NO hay usuario → login
      if (!data.user) {
        router.push("/login");
      }

      // 👉 Si SÍ hay usuario → se queda aquí (home)
    }

    checkUser();
  }, [router]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>My Diecast Garage</h1>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => router.push("/capture-packed")}>
          Add Packed
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => router.push("/capture-loose")}>
          Add Loose
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => router.push("/mygarage")}>
          My Garage
        </button>
      </div>
    </div>
  );
}