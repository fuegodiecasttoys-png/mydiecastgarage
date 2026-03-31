"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type WishlistItem = {
  id: number;
  name: string | null;
  brand: string | null;
  color: string | null;
  scale: string | null;
  main_number: string | null;
  sub_number: string | null;
  series: string | null;
  year: string | null;
  notes: string | null;
  priority: "high" | "medium" | "low" | null;
};

export default function Wishlist() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setItems(data as WishlistItem[]);
      }

      setLoading(false);
    };

    fetchWishlist();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        padding: 20,
        color: "#fff",
      }}
    >
      {/* HOME BUTTON */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: 20,
        }}
      >
        🏠
      </button>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 30,
            marginBottom: 20,
          }}
        >
          <h1>⭐ My Wishlist</h1>

          <button onClick={() => router.push("/wishlist/add")}>
            + Add
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No items yet...</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <a
                key={item.id}
                href={`/wishlist/${item.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {item.name || "Unnamed"}
                  </div>

                  <div style={{ opacity: 0.7, marginTop: 4 }}>
                    {item.brand || "-"}{" "}
                    {item.color ? `• ${item.color}` : ""}{" "}
                    {item.scale ? `• ${item.scale}` : ""}
                  </div>

                  <div style={{ opacity: 0.6, marginTop: 4 }}>
                    {item.series || "-"}{" "}
                    {item.main_number ? `• ${item.main_number}` : ""}{" "}
                    {item.sub_number ? `• ${item.sub_number}` : ""}{" "}
                    {item.year ? `• ${item.year}` : ""}
                  </div>

                  {item.priority && (
                    <div style={{ marginTop: 6 }}>
                      {item.priority === "high" && "🔴 High"}
                      {item.priority === "medium" && "🟡 Medium"}
                      {item.priority === "low" && "🟢 Low"}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
