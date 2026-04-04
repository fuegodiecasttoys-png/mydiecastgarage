"use client";

import { useEffect, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import Link from "next/link";

const buttonStyle: CSSProperties = {
  minHeight: 92,
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(14,14,16,0.96)",
  color: "#ffffff",
  fontSize: 18,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(0,0,0,0.32)",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 430,
  background: "rgba(14,14,16,0.88)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 32,
  padding: "30px 20px 24px",
  boxShadow:
    "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
  backdropFilter: "blur(10px)",
};

export default function Home() {
  const router = useRouter();

  // 🔒 Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Error logging out");
      return;
    }

    router.push("/login");
  };

  // 🔒 Check user logged in
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
        "radial-gradient(circle at top, rgba(18,95,255,0.18), transparent 35%), #05070d",
      display: "grid",
      placeItems: "center",
      padding: 20,
      fontFamily: "system-ui, sans-serif",
      position: "relative",
    }}
  >
    {/* TOP BUTTONS */}
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        display: "flex",
        gap: 10,
      }}
    >
      <button
        onClick={() => router.push("/")}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 8,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Home
      </button>

      <button
        onClick={handleLogout}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 8,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>
    </div>

    {/* CARD */}
    <div style={{ ...cardStyle, position: "relative" }}>

      <button
  onClick={handleLogout}
  style={{
    position: "absolute",
    top: 20,
    right: 20,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
  }}
>
  Logout
</button>

      {/* LOGO */}
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <img
          src="/logo.png"
          alt="My Diecast Garage"
          style={{
            width: 215,
            maxWidth: "84%",
            height: "auto",
            display: "block",
            margin: "0 auto",
            filter: "drop-shadow(0 0 24px rgba(30,144,255,0.18))",
          }}
        />
      </div>

      {/* TOP GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => router.push("/capture-packed")}
          style={{ ...buttonStyle, width: "100%" }}
        >
          Add Packed
        </button>

        <button
          onClick={() => router.push("/capture-loose")}
          style={{ ...buttonStyle, width: "100%" }}
        >
          Add Loose
        </button>
      </div>

      {/* MY GARAGE */}
      <button
        onClick={() => router.push("/mygarage")}
        style={{
          ...buttonStyle,
          width: "100%",
          minHeight: 112,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
          My Garage
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.66)",
          }}
        >
          View your collection
        </div>
      </button>

      {/* WISHLIST */}
      <button
        onClick={() => router.push("/wishlist")}
        style={{
          ...buttonStyle,
          width: "100%",
          marginBottom: 16,
        }}
      >
        Wishlist
      </button>

      {/* ADD FRIENDS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <button
          style={{
            ...buttonStyle,
            width: "100%",
          }}
        >
          Add Friends
        </button>
        <span style={{ fontSize: 12, opacity: 0.5, marginTop: 6 }}>
          coming soon
        </span>
      </div>

      {/* HOW TO */}
      <button
        onClick={() => router.push("/howto")}
        style={{
          ...buttonStyle,
          width: "100%",
        }}
      >
        How To
      </button>
    </div>
  </div>
);
}
