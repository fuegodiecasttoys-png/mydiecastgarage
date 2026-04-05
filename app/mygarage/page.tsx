"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import Link from "next/link"

type Item = {
  id: number
  name: string | null
  brand: string | null
  color: string | null
  scale: string | null
  photo_url: string | null
  type: string | null
  main_number: string | null
  sub_number: string | null
  series: string | null
  year: string | null
  location: string | null
  qty: number | null
  sth: boolean | null
  th: boolean | null
  chase: boolean | null
}

export default function MyGarage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const fetchItems = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    setLoading(false)
    return
  }

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (!error) {
    setItems((data as Item[]) || [])
  }

  setLoading(false)
}


    fetchItems()
  }, [])

  const handleExport = () => {
    const headers = [
      "Name",
      "Brand",
      "Color",
      "Scale",
      "Type",
      "Main #",
      "Sub #",
      "Series",
      "Year",
      "Location",
      "Qty",
    ]

    const rows = items.map((item) => [
      item.name ?? "",
      item.brand ?? "",
      item.color ?? "",
      item.scale ?? "",
      item.type ?? "",
      item.main_number ?? "",
      item.sub_number ?? "",
      item.series ?? "",
      item.year ?? "",
      item.location ?? "",
      item.qty ?? "",
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "my_diecast_garage.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase()

    return (
      item.name?.toLowerCase().includes(text) ||
      item.brand?.toLowerCase().includes(text) ||
      item.color?.toLowerCase().includes(text)
    )
  })
  const sortedItems = [...filteredItems].sort((a, b) => {
  if (sort === "newest") {
    return (b.id ?? 0) - (a.id ?? 0)
  }

  if (sort === "oldest") {
    return (a.id ?? 0) - (b.id ?? 0)
  }

  if (sort === "az") {
    return (a.name ?? "").localeCompare(b.name ?? "")
  }

  if (sort === "za") {
    return (b.name ?? "").localeCompare(a.name ?? "")
  }

  return 0
})

  const startIndex = (page - 1) * itemsPerPage
const paginatedItems = sortedItems.slice(
  startIndex,
  startIndex + itemsPerPage
)

const totalPages = Math.ceil(filteredItems.length / itemsPerPage)


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        padding: 20,
        color: "#fff",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Link
  href="/"
  style={{
    position: "absolute",
    top: 20,
    left: 20,
    fontSize: 20,
    textDecoration: "none",
    color: "white",
    zIndex: 10,
  }}
>
  🏠
</Link>
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
    display: "flex",
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  }}
>
  <input
    type="text"
    placeholder="Search your garage..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      flex: 1,
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #333",
      background: "#111",
      color: "white",
      fontSize: 14,
      boxSizing: "border-box",
    }}
  />

  <button
    type="button"
    style={{
      width: 44,
      borderRadius: 8,
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.05)",
      color: "white",
      fontSize: 16,
      cursor: "pointer",
    }}
  >
    🔎
  </button>
</div>
<select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #333",
    background: "#111",
    color: "white",
    fontSize: 14
  }}
>
  <option value="newest">Newest</option>
  <option value="oldest">Oldest</option>
  <option value="az">A → Z</option>
  <option value="za">Z → A</option>
</select>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <button
  onClick={() => alert("Pro feature 💎")}
  style={{
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: 13,
    cursor: "pointer",
    opacity: 0.6,
  }}
>
  Export to Excel 🔒
</button>
          </div>

          <div
            style={{
              opacity: 0.72,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <div
  style={{
    opacity: 0.72,
    fontSize: 16,
    fontWeight: 600,
  }}
>
  {items.length} diecasts in your garage 🚗🔥
</div>
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
            {paginatedItems.map((item) => (
              <a
                key={item.id}
                href={`/car/${item.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  {item.type === "packed" ? (
                    <span
                      style={{
                        background: "#1e3a8a",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    >
                      📦 Packed
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "#065f46",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    >
                      🟢 Loose
                    </span>
                  )}
                </div>

                <div
  style={{
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    background:
      "linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    transition: "all 0.2s ease",
  }}
>
                  {/* IMAGE */}
                  <div
  style={{
    width: 70,
    height: 70,
    borderRadius: 16,
    overflow: "hidden",
    flexShrink: 0,
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
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
                      {item.brand ?? "Unknown"} • {item.type ?? "no-type"}
                    </div>

                    <div
  style={{
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: 6,
    wordBreak: "break-word",
    paddingRight: 72,
    color: "#ffffff",
    letterSpacing: "-0.02em",
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
                      <div
  style={{
    display: "flex",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  }}
>
  {item.sth && (
    <span
      style={{
        background: "#f59e0b",
        color: "#000",
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      🔥 STH
    </span>
  )}

  {item.th && (
    <span
      style={{
        background: "#22c55e",
        color: "#000",
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      TH
    </span>
  )}

  {item.chase && (
    <span
      style={{
        background: "#e11d48",
        color: "#fff",
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      Chase
    </span>
  )}
</div>
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
        {!loading && filteredItems.length === 0 && (
          <div
            style={{
              marginTop: 30,
              opacity: 0.6,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            No results found.
          </div>
        )}
{totalPages > 1 && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 10,
      marginTop: 20,
    }}
  >
    <button
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      disabled={page === 1}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid #333",
        background: "#111",
        color: "white",
        opacity: page === 1 ? 0.4 : 1,
        cursor: "pointer",
      }}
    >
      ⬅️
    </button>

    <span style={{ alignSelf: "center", fontSize: 14 }}>
      {page} / {totalPages}
    </span>

    <button
      onClick={() =>
        setPage((p) => Math.min(p + 1, totalPages))
      }
      disabled={page === totalPages}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid #333",
        background: "#111",
        color: "white",
        opacity: page === totalPages ? 0.4 : 1,
        cursor: "pointer",
      }}
    >
      ➡️
    </button>
  </div>
)}

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