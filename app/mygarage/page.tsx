"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Item = {
  id: number
  name: string | null
  brand: string | null
  color: string | null
  scale: string | null
  photo_url: string | null
  type: string |null
}

export default function MyGarage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error) {
        setItems((data as Item[]) || [])
      }

      setLoading(false)
    }

    fetchItems()
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        padding: 20,
        color: "#fff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <img
            src="/logo.png"
            alt="My Diecast Garage"
            style={{
              width: 170,
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />

          <h1
            style={{
              fontSize: 28,
              margin: "10px 0 4px 0",
              fontWeight: 800,
            }}
          >
            My Garage
          </h1>

          <div
            style={{
              opacity: 0.72,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {items.length} diecasts
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <p
            style={{
              opacity: 0.7,
              fontSize: 16,
              marginTop: 8,
            }}
          >
            Loading...
          </p>
        )}

        {/* LIST */}
        {!loading && (
          <div style={{ display: "grid", gap: 16 }}>
            {items.map((item) => (
              <a
                key={item.id}
                href={`/car/${item.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 16,
                    background:
                      "linear-gradient(180deg, #171717 0%, #101010 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    position: "relative",
                  }}
                  >
                    <div
  style={{
    position: "absolute",
    top: 6,
    right: 6,
    fontSize: 14,
  }}
>
  {item.type === "sth" && (
    <span style={{ color: "gold" }}>
      ⭐
    </span>
  )}
</div>

                  {/* IMAGE */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#222",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt={item.name ?? "Diecast photo"}
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
                          fontSize: 12,
                          opacity: 0.5,
                        }}
                      >
                        No photo
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.7,
                        textTransform: "uppercase",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        marginBottom: 4,
                      }}
                    >
                      {item.brand ?? "Unknown"}
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.1,
                        marginBottom: 4,
                        wordBreak: "break-word",
                        paddingRight: 72,
                      }}
                    >
                      {item.name ?? "Unnamed model"}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        opacity: 0.85,
                        fontWeight: 500,
                      }}
                    >
                      {item.color ?? "-"}
                    </div>
                  </div>

                  {/* SCALE */}
                  <span
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {item.scale ?? "-"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <div
            style={{
              marginTop: 30,
              opacity: 0.6,
              fontSize: 16,
            }}
          >
            Your garage is empty.
          </div>
        )}
      </div>
    </div>
  )
}