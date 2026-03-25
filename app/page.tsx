"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(32,110,255,0.12) 0%, rgba(11,11,11,1) 28%, rgba(8,8,8,1) 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
        padding: "24px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          background: "rgba(20,20,20,0.88)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 28,
          padding: "32px 24px",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <Image
            src="/logo.png"
            alt="My Diecast Garage logo"
            width={170}
            height={170}
            style={{ width: "170px", height: "auto", objectFit: "contain" }}
            priority
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <button
            onClick={() => router.push("/capture-packed")}
            style={buttonStyle}
          >
            Add Packed
          </button>

          <button
            onClick={() => router.push("/capture-loose")}
            style={buttonStyle}
          >
            Add Loose
          </button>
        </div>

        <button
          onClick={() => router.push("/mygarage")}
          style={{
            ...buttonStyle,
            width: "100%",
            marginBottom: 18,
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800 }}>My Garage</div>
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <button style={buttonStyle}>How To</button>

          <button style={buttonStyle}>Add Friends</button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(18,18,18,0.95)",
  color: "#ffffff",
  borderRadius: 20,
  padding: "20px 16px",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
};
