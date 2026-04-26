"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"
import { t } from "../ui/dv-tokens"
import {
  dvAppPageShell,
  dvDashboardInner,
  dvGhostButton,
  dvImageThumb,
  dvListCard,
  dvModelListCardHoverHandlers,
  dvInput,
  dvSelect,
} from "../ui/dv-visual"


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

const pageStyle = dvAppPageShell

const containerStyle = dvDashboardInner

const homeLinkStyle = {
  position: "absolute",
  top: 20,
  left: 20,
  fontSize: 20,
  textDecoration: "none",
  color: t.textPrimary,
  zIndex: 10,
} as const

const searchInputStyle = { ...dvInput, flex: 1, width: "auto", padding: "10px 12px", fontSize: 14 }

const searchButtonStyle = {
  ...dvGhostButton,
  width: 44,
  padding: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: 12,
  fontSize: 16,
} as const

const sortSelectStyle = { ...dvSelect, marginBottom: 10 }

const exportButtonStyle = { ...dvGhostButton, borderRadius: 12 }

const cardStyle = { ...dvListCard, ...dvModelListCardHoverHandlers, transition: "all 0.2s ease" as const }

const imageWrapStyle = { ...dvImageThumb }

function escapeCsvCell(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) return ""
  const s = String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function downloadGarageCsv(rows: Item[]) {
  const cols: (keyof Item)[] = [
    "id",
    "name",
    "brand",
    "color",
    "scale",
    "type",
    "main_number",
    "sub_number",
    "series",
    "year",
    "location",
    "qty",
    "sth",
    "th",
    "chase",
  ]
  const header = cols.join(",")
  const body = rows.map((row) =>
    cols.map((c) => escapeCsvCell(row[c] as string | number | boolean | null)).join(",")
  )
  const csv = [header, ...body].join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `my-garage-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const scaleBadgeStyle = {
  position: "absolute" as const,
  right: 10,
  bottom: 10,
  fontSize: 12,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255, 122, 24, 0.24)",
  background: "rgba(255, 122, 24, 0.08)",
  color: t.textSecondary,
} as const

export default function MyGarage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const router = useRouter()
  const itemsPerPage = 20

  useEffect(() => {
    async function fetchItems() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
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
  }, [router])

  const filteredItems = useMemo(() => {
    const text = search.toLowerCase().trim()

    if (!text) return items

    return items.filter((item) => {
      return (
        item.name?.toLowerCase().includes(text) ||
        item.brand?.toLowerCase().includes(text) ||
        item.color?.toLowerCase().includes(text)
      )
    })
  }, [items, search])

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems]

    sorted.sort((a, b) => {
      if (sort === "newest") return (b.id ?? 0) - (a.id ?? 0)
      if (sort === "oldest") return (a.id ?? 0) - (b.id ?? 0)
      if (sort === "az") return (a.name ?? "").localeCompare(b.name ?? "")
      if (sort === "za") return (b.name ?? "").localeCompare(a.name ?? "")
      return 0
    })

    return sorted
  }, [filteredItems, sort])

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  return (
    <div style={pageStyle}>
      <Link href="/" style={homeLinkStyle}>
        🏠
      </Link>

      <div style={containerStyle}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <img
            src="/logo.png"
            alt="My Diecast Garage"
            style={{
              width: 120,
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
              color: t.textPrimary,
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
              style={searchInputStyle}
            />

            <button type="button" style={searchButtonStyle}>
              🔎
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={sortSelectStyle}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => {
                if (sortedItems.length === 0) {
                  alert("No items to export.")
                  return
                }
                downloadGarageCsv(sortedItems)
              }}
              style={exportButtonStyle}
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => router.push("/favorites")}
              style={{
                ...dvGhostButton,
                borderRadius: 999,
                border: "1px solid rgba(255, 122, 24, 0.32)",
                color: t.orange400,
                fontWeight: 700,
              }}
            >
              ⭐ Favorites
            </button>

          </div>
        </div>

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

        {!loading && paginatedItems.length > 0 && (
          <div style={{ display: "grid", gap: 16 }}>
            {paginatedItems.map((item) => (
              <Link
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
                        background: "rgba(255, 122, 24, 0.1)",
                        color: t.textPrimary,
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        border: "1px solid rgba(255, 122, 24, 0.3)",
                      }}
                    >
                      📦 Packed
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        color: t.textSecondary,
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        border: `1px solid ${t.borderSubtle}`,
                      }}
                    >
                      Loose
                    </span>
                  )}
                </div>

                <div style={cardStyle}>
                  <div style={imageWrapStyle}>
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
                        color: t.textPrimary,
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
                    </div>

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
                            background: "rgba(255, 200, 90, 0.12)",
                            color: t.textPrimary,
                            border: "1px solid rgba(255, 200, 100, 0.35)",
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
                            background: "rgba(255, 122, 24, 0.14)",
                            color: t.textPrimary,
                            border: "1px solid rgba(255, 122, 24, 0.3)",
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
                            background: "rgba(200, 50, 70, 0.2)",
                            color: "#F5F7FA",
                            border: "1px solid rgba(200, 70, 90, 0.4)",
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

                  <span style={scaleBadgeStyle}>{item.scale ?? "-"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div
            style={{
              marginTop: 30,
              opacity: 0.6,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Your garage is empty.
          </div>
        )}

        {!loading && items.length > 0 && filteredItems.length === 0 && (
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

        {!loading && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 20,
            }}
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                ...dvGhostButton,
                padding: "6px 12px",
                borderRadius: 10,
                opacity: page === 1 ? 0.4 : 1,
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ⬅️
            </button>

            <span style={{ alignSelf: "center", fontSize: 14, color: t.textSecondary }}>
              {page} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                ...dvGhostButton,
                padding: "6px 12px",
                borderRadius: 10,
                opacity: page === totalPages ? 0.4 : 1,
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  )
}