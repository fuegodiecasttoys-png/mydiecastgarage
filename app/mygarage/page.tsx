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
  type: string | null
  main_number: string | null
  sub_number: string | null
  series: string | null
  year: string | null
  location: string | null
  qty: number | null
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
              onClick={handleExport}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Export to Excel
            </button>
          </div>

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
                    padding: 10,
                    borderRadius: 16,
                    background:
                      "linear-gradient(180deg, #171717 0%, #101010 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    position: "relative",
                  }}
                >
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
                      {item.brand ?? "Unknown"} • {item.type ?? "no-type"}
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