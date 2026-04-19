"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"
import { FullPageLoading } from "../../components/FullPageLoading"

type WishlistItem = {
  id: number
  model: string | null
  brand: string | null
  color: string | null
  scale: string | null
  main_number: string | null
  sub_number: string | null
  series: string | null
  year: string | null
  notes: string | null
  priority: "high" | "medium" | "low" | null
  photo_url: string | null
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
  maxWidth: 420,
  margin: "0 auto",
}

const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
  width: "100%",
}

const labelStyle: CSSProperties = {
  opacity: 0.6,
  minWidth: 96,
}

const valueStyle: CSSProperties = {
  textAlign: "right",
  flex: 1,
  wordBreak: "break-word",
}

function priorityLabel(priority: WishlistItem["priority"]) {
  if (priority === "high") return "High"
  if (priority === "low") return "Low"
  return "Medium"
}

export default function WishlistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = params.id

  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<WishlistItem | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const idNum = Number(Array.isArray(rawId) ? rawId[0] : rawId)
      if (!Number.isFinite(idNum) || idNum <= 0) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("id", idNum)
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        setNotFound(true)
        setLoading(false)
        return
      }

      if (!data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setItem(data as WishlistItem)
      setLoading(false)
    }

    void load()
  }, [rawId, router])

  async function handleDelete() {
    if (!item) return
    setDeleting(true)
    const { error } = await supabase.from("wishlist").delete().eq("id", item.id)

    if (error) {
      console.error(error)
      alert("Could not remove this wishlist item.")
      setDeleting(false)
      setShowDeleteModal(false)
      return
    }

    router.replace("/wishlist")
  }

  if (loading) {
    return <FullPageLoading label="Loading wishlist item..." />
  }

  if (notFound || !item) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{ marginBottom: 20 }}>
            <Link
              href="/wishlist"
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                textDecoration: "underline",
              }}
            >
              Back to wishlist
            </Link>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
            Not found
          </h1>
          <p style={{ opacity: 0.72, lineHeight: 1.5 }}>
            This wishlist item does not exist or you do not have access to it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Link
            href="/wishlist"
            style={{
              justifySelf: "start",
              color: "#fff",
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            Back
          </Link>

          <span
            style={{
              justifySelf: "center",
              fontSize: 14,
              fontWeight: 700,
              opacity: 0.85,
            }}
          >
            Wishlist
          </span>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            style={{
              justifySelf: "end",
              padding: "7px 12px",
              borderRadius: 999,
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.06)",
              color: "#f87171",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 240,
            aspectRatio: "1",
            borderRadius: 18,
            overflow: "hidden",
            background: "#222",
            margin: "0 auto 20px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt={item.model ?? "Wishlist item"}
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
                height: "100%",
                display: "grid",
                placeItems: "center",
                opacity: 0.45,
                fontSize: 14,
              }}
            >
              No photo
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 6,
            }}
          >
            {item.model ?? "Unnamed model"}
          </div>
          <div style={{ opacity: 0.72, fontSize: 14, fontWeight: 600 }}>
            {item.brand ?? "Unknown brand"}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: 600,
              opacity: 0.8,
            }}
          >
            Priority: {priorityLabel(item.priority)}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, #171717 0%, #101010 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={rowStyle}>
            <span style={labelStyle}>Color</span>
            <span style={valueStyle}>{item.color ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Scale</span>
            <span style={valueStyle}>{item.scale ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Main #</span>
            <span style={valueStyle}>{item.main_number ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Sub #</span>
            <span style={valueStyle}>{item.sub_number ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Series</span>
            <span style={valueStyle}>{item.series ?? "-"}</span>
          </div>
          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>Year</span>
            <span style={valueStyle}>{item.year ?? "-"}</span>
          </div>
        </div>

        {item.notes ? (
          <div
            style={{
              background: "linear-gradient(180deg, #171717 0%, #101010 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            <div style={{ opacity: 0.6, marginBottom: 8, fontSize: 14 }}>
              Notes
            </div>
            <div style={{ lineHeight: 1.5, wordBreak: "break-word" }}>
              {item.notes}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            href="/wishlist"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            Back to wishlist
          </Link>
        </div>
      </div>

      {showDeleteModal && (
        <div
          role="presentation"
          onClick={() => !deleting && setShowDeleteModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
              maxWidth: 300,
              width: "100%",
            }}
          >
            <p style={{ marginBottom: 20 }}>Remove this item from your wishlist?</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  background: "#222",
                  color: "#fff",
                  border: "none",
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
