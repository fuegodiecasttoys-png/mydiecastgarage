"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const [garageCount, setGarageCount] = useState(0);

  useEffect(() => {
    const loadGarageCount = async () => {
      const { count, error } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error loading garage count:", error);
        setGarageCount(0);
        return;
      }

      setGarageCount(count ?? 0);
    };

    loadGarageCount();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f10",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        padding: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#1a1a1d",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
          padding: 28,
          minHeight: 620,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 8,
            marginBottom: 36,
          }}
        >
          <img
            src="/logo.png"
            alt="My Diecast Garage"
            style={{
              width: 170,
              height: "auto",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            gap: 12,
            marginBottom: 36,
          }}
        >
          <Link href="/capture-packed" style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "18px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#171717",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add Packed
            </button>
          </Link>

          <Link href="/capture-loose" style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "18px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#171717",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add Loose
            </button>
          </Link>
        </div>

        <Link href="/mygarage" style={{ width: "100%", textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "22px 16px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "#1f1f1f",
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 36,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div>My Garage</div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                fontWeight: 600,
              }}
            >
              {garageCount} models
            </div>
          </button>
        </Link>

        <div
          style={{
            width: "100%",
            display: "flex",
            gap: 12,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "16px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#141414",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            How To
          </button>

          <button
            style={{
              flex: 1,
              padding: "16px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#141414",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Add Friends
          </button>
        </div>
      </div>
    </div>
  );
}
