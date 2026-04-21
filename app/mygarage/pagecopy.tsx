"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoadError(error.message);
        setItems([]);
      } else {
        setItems(data ?? []);
      }

      setLoading(false);
    };

    fetchItems();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        fontFamily: "system-ui",
        padding: 12,
      }}
    >
      {/* CONTENEDOR CENTRAL */}
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* HEADER LOGO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: 6,
            marginBottom: 12,
          }}
        >
          <Image
            src="/logo.png"
            alt="Diecast Vault"
            width={120}
            height={120}
            style={{ display: "block", width: 120, height: "auto" }}
            priority
          />
        </div>

        {/* TITULO */}
        <h1
          style={{
            fontSize: 28,
            marginBottom: 8,
            color: "#fff",
          }}
        >
          Diecast Vault
        </h1>

        {/* ESTADO */}
        {loadError ? (
          <p style={{ color: "red" }}>Error: {loadError}</p>
        ) : (
          <p style={{ color: "limegreen", marginBottom: 20 }}>
            Connected successfully 🚀
          </p>
        )}

        {/* LOADING */}
        {loading && (
          <p style={{ opacity: 0.8, color: "#fff" }}>Loading items...</p>
        )}

        {/* GRID ITEMS */}
        {!loading && (
          <div
            style={{
              display: "grid",
              gap: 16,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {items.map((item: any) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 18,
                  padding: 14,
                  background:
                    "linear-gradient(180deg, #171717 0%, #101010 100%)",
                  color: "#fff",
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  width: "100%",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
                }}
              >
                {/* FOTO */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#222",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.name ?? "Diecast"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#bbb",
                        textAlign: "center",
                        padding: 6,
                      }}
                    >
                      No photo
                    </div>
                  )}
                </div>

                {/* TEXTO */}
                <div style={{ minWidth: 0 }}>
                  {/* MARCA */}
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 300,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.brand ?? "Unknown"}
                  </div>

                  {/* MODELO */}
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      lineHeight: 1.1,
                      color: "#fff",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.name ?? "Unnamed model"}
                  </div>

                  {/* COLOR + ESCALA */}
                  <div
                    style={{
                      opacity: 0.82,
                      marginTop: 8,
                      fontSize: 14,
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
  <span>{item.color ?? "-"}</span>

  <span
    style={{
      fontSize: 12,
      padding: "2px 8px",
      borderRadius: 6,
      background: "#1f1f1f",
      border: "1px solid #333"
    }}
  >
    {item.scale ?? "-"}
  </span>
</div>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && !loadError && (
              <div style={{ opacity: 0.7, color: "#fff" }}>
                No items yet. Add one in Supabase 👇
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}