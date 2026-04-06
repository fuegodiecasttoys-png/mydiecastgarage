"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabaseClient"

type Item = {
  id: number
  brand: string | null
  name: string | null
  color: string | null
  scale: string | null
  photo_url: string | null
  favorite: boolean | null
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#0f0f0f",
  color: "#fff",
  padding: 20,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
}

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 520,
  margin: "0 auto",
}

const topBarStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  marginBottom: 20,
}

const ghostButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "#fff",
  padding: 0,
  cursor: "pointer",
  fontSize: 16,
}

export default function FavoritesPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavorites() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const { data, error } = await supabase
        .from("items")
        .select("id, brand, name, color, scale, photo_url, favorite")
        .eq("user_id", user.id)
        .eq("favorite", true)
        .order("id", { ascending: false })

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      setItems(data || [])
      setLoading(false)
    }

    loadFavorites()
  }, [router])

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={topBarStyle}>
          <button
            onClick={() => router.push("/")}
            style={{ ...ghostButtonStyle, justifySelf: "start" }}
          >
            Back
          </button>

          <div
            style={{
              justifySelf: "center",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            ⭐ Favorites
          </div>

          <div />
        </div>

        {loading ? (
          <div style={{ opacity: 0.7, textAlign: "center", marginTop: 40 }}>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div style={{ opacity: 0.7, textAlign: "center", marginTop: 40 }}>
            No favorite cars yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/car/${item.id}`)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "linear-gradient(180deg, #171717 0%, #101010 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: 14,
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "#222",
                    flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.name || "Diecast"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : null}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.name ?? "Unnamed model"}
                    </div>

                    <div style={{ fontSize: 18, flexShrink: 0 }}>⭐</div>
                  </div>

                  <div
                    style={{
                      opacity: 0.72,
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {item.brand ?? "Unknown brand"}
                  </div>

                  <div
                    style={{
                      opacity: 0.65,
                      fontSize: 13,
                    }}
                  >
                    {item.color ?? "-"} • {item.scale ?? "-"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}