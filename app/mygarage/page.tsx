"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchProfile, isActiveProRow } from "../lib/fetchProfile"
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

const cardStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: 8,
  borderRadius: 12,
  background: "#0f172a",
  minHeight: 70, // 👈 clave (antes estaba grande)
}

const imageWrapStyle = {
  width: 60,
  height: 60,
  borderRadius: 10,
  overflow: "hidden",
  flexShrink: 0,
}

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
  const [userId, setUserId] = useState<string | null>(null)
  const [isActivePro, setIsActivePro] = useState(false)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const router = useRouter()
  const itemsPerPage = 20

  const loadPlanProfile = useCallback(async (uid: string) => {
    const row = await fetchProfile(uid, "plan, is_active")
    setIsActivePro(isActiveProRow(row))
  }, [])

  useEffect(() => {
    async function fetchItems() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }
      setUserId(user.id)

      await loadPlanProfile(user.id)

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
  }, [router, loadPlanProfile])

  useEffect(() => {
    if (!userId) return
    const handleFocus = () => {
      void loadPlanProfile(userId)
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [userId, loadPlanProfile])

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
    justifyContent: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 16,
  }}
>
  <button
    type="button"
    onClick={() => router.push("/capture-packed")}
    style={{
      padding: "10px 16px",
      borderRadius: 14,
      border: "1px solid #f97316",
      background: "rgba(249, 115, 22, 0.12)",
      color: "#f97316",
      fontWeight: 800,
      fontSize: 14,
    }}
  >
    📦 + Packed
  </button>

  <button
    type="button"
    onClick={() => router.push("/capture-loose")}
    style={{
      padding: "10px 16px",
      borderRadius: 14,
      border: "1px solid #f97316",
      background: "rgba(249, 115, 22, 0.12)",
      color: "#f97316",
      fontWeight: 800,
      fontSize: 14,
    }}
  >
    🚗 + Loose
  </button>
</div>

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
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              style={searchInputStyle}
            />

            <button type="button" style={searchButtonStyle}>
              🔎
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
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
              onClick={async () => {
                if (!userId) {
                  alert("Not logged in")
                  return
                }

                const row = await fetchProfile(userId, "plan, is_active")
                const canExport = isActiveProRow(row)
                if (!canExport) {
                  alert("CSV export is a Pro feature.")
                  return
                }

                if (sortedItems.length === 0) {
                  alert("No items to export.")
                  return
                }
                downloadGarageCsv(sortedItems)
              }}
              disabled={!isActivePro}
              style={{
                ...exportButtonStyle,
                opacity: !isActivePro ? 0.5 : 1,
                cursor: !isActivePro ? "not-allowed" : "pointer",
              }}
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
  <div style={{ display: "grid", gap: 8 }}>
    {paginatedItems.map((item) => (
      <Link
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
            alignItems: "center",
            gap: 12,
            padding: 8,
            borderRadius: 14,
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt={item.name ?? "Diecast photo"}
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: t.textSecondary,
                flexShrink: 0,
              }}
            >
              No photo
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: t.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.name ?? "Unnamed model"}
            </div>

            <div
              style={{
                fontSize: 12,
                color: t.textSecondary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: 2,
              }}
            >
              {item.brand ?? "-"} • {item.color ?? "-"} • {item.scale ?? "-"} • Qty{" "}
              {item.qty ?? 1}
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 6,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background:
                    item.type === "packed"
                      ? "rgba(255, 122, 24, 0.10)"
                      : "rgba(255,255,255,0.04)",
                  color: item.type === "packed" ? t.textPrimary : t.textSecondary,
                  padding: "2px 8px",
                  borderRadius: 7,
                  fontSize: 11,
                  border:
                    item.type === "packed"
                      ? "1px solid rgba(255, 122, 24, 0.30)"
                      : `1px solid ${t.borderSubtle}`,
                }}
              >
                {item.type === "packed" ? "📦 Packed" : "Loose"}
              </span>

              {item.sth && (
                <span
                  style={{
                    background: "rgba(255, 200, 90, 0.12)",
                    color: t.textPrimary,
                    border: "1px solid rgba(255, 200, 100, 0.35)",
                    padding: "2px 8px",
                    borderRadius: 7,
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
                    borderRadius: 7,
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
                    borderRadius: 7,
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