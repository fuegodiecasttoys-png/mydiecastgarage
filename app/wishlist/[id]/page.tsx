"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"
import { FullPageLoading } from "../../components/FullPageLoading"
import { t } from "../../ui/dv-tokens"
import {
  dvAppPageShell,
  dvDashboardInner,
  dvDisplayFont,
  dvGhostButton,
  dvModelCardBorder,
  dvModelHeroImageBorder,
  dvModelHeroImageGlow,
  dvModelListCardShadowRest,
} from "../../ui/dv-visual"

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

const pageStyle: CSSProperties = dvAppPageShell

const containerStyle: CSSProperties = dvDashboardInner

const detailPanelStyle: CSSProperties = {
  background: t.surface,
  border: dvModelCardBorder,
  borderRadius: t.radiusLg,
  padding: 16,
  marginBottom: 16,
  boxShadow: dvModelListCardShadowRest,
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
  color: t.textMuted,
  minWidth: 96,
  fontSize: 13,
  fontWeight: 600,
}

const valueStyle: CSSProperties = {
  textAlign: "right",
  flex: 1,
  wordBreak: "break-word",
  color: t.textPrimary,
  fontSize: 14,
  fontWeight: 500,
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
                ...dvGhostButton,
                background: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
                display: "inline-block",
                fontSize: 16,
                textDecoration: "underline",
                color: t.textPrimary,
              }}
            >
              Back to wishlist
            </Link>
          </div>
          <h1
            style={{
              fontFamily: dvDisplayFont,
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 12,
              color: t.textPrimary,
            }}
          >
            Not found
          </h1>
          <p style={{ color: t.textSecondary, lineHeight: 1.5 }}>
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
              color: t.textPrimary,
              fontSize: 16,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back
          </Link>

          <span
            style={{
              justifySelf: "center",
              fontSize: 14,
              fontWeight: 700,
              color: t.textSecondary,
              fontFamily: dvDisplayFont,
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
              borderRadius: t.radiusMd,
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
            borderRadius: t.radiusLg,
            overflow: "hidden",
            background: t.bgSecondary,
            margin: "0 auto 20px",
            border: dvModelHeroImageBorder,
            boxShadow: `${dvModelHeroImageGlow}, 0 10px 28px rgba(0,0,0,0.35)`,
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
                color: t.textMuted,
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
              fontFamily: dvDisplayFont,
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 6,
              color: t.textPrimary,
            }}
          >
            {item.model ?? "Unnamed model"}
          </div>
          <div style={{ color: t.textSecondary, fontSize: 14, fontWeight: 600 }}>
            {item.brand ?? "Unknown brand"}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: 600,
              color: t.textMuted,
            }}
          >
            Priority: {priorityLabel(item.priority)}
          </div>
        </div>

        <div style={detailPanelStyle}>
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
          <div style={{ ...detailPanelStyle, marginBottom: 0 }}>
            <div style={{ color: t.textMuted, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Notes
            </div>
            <div style={{ lineHeight: 1.5, wordBreak: "break-word", color: t.textPrimary }}>
              {item.notes}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            href="/wishlist"
            style={{
              ...dvGhostButton,
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: t.radiusMd,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 700,
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
              background: t.surface,
              padding: 20,
              borderRadius: t.radiusLg,
              border: dvModelCardBorder,
              boxShadow: dvModelListCardShadowRest,
              textAlign: "center",
              maxWidth: 300,
              width: "100%",
            }}
          >
            <p style={{ marginBottom: 20, color: t.textPrimary }}>
              Remove this item from your wishlist?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                style={{
                  ...dvGhostButton,
                  flex: 1,
                  padding: "10px",
                  borderRadius: t.radiusMd,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                  borderRadius: t.radiusMd,
                  background: "#ef4444",
                  color: "#fff",
                  border: "1px solid rgba(239,68,68,0.45)",
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.7 : 1,
                  fontWeight: 700,
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
