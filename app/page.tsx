"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { FullPageLoading } from "./components/FullPageLoading";

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
  background: "#0e0e10",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: "30px 20px 24px",
  boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
  backdropFilter: "blur(10px)",
  overflow: "hidden",
};

function garageCountLabel(count: number) {
  if (count === 0) return "No cars yet";
  if (count === 1) return "1 car";
  return `${count} cars`;
}

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [garageCount, setGarageCount] = useState(0);
  // 🔒 Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Error logging out");
      return;
    }

    router.replace("/login");
  };

  // 🔒 Check user logged in + load garage total (same source as My Garage list)
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const { count, error } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", data.user.id);

      if (!error && count !== null) {
        setGarageCount(count);
      } else {
        setGarageCount(0);
      }

      setCheckingAuth(false);
    }

    void checkUser();
  }, [router]);
  if (checkingAuth) {
    return <FullPageLoading label="Loading your garage..." />;
  }

 return (
  <div
    style={{
      minHeight: "100vh",
      background: "#05070d",
      display: "grid",
      placeItems: "center",
      padding: 20,
      fontFamily: "system-ui, sans-serif",
      position: "relative",
    }}
  >
    
    

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
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          My Garage
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.52)",
            marginBottom: 6,
            letterSpacing: "0.01em",
          }}
        >
          {garageCountLabel(garageCount)}
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
