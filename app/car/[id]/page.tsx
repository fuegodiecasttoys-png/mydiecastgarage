"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"
import { FullPageLoading } from "../../components/FullPageLoading"
import { t } from "../../ui/dv-tokens"
import {
  dvAppPageShell,
  dvBodyFont,
  dvCardOrangeBorder,
  dvDashboardInner,
  dvDisplayFont,
  dvGhostButton,
  dvInput,
  dvOrangeGlowSubtle,
} from "../../ui/dv-visual"

type Item = {
  id: number
  brand: string | null
  name: string | null
  color: string | null
  scale: string | null
  year: string | null
  series: string | null
  main_number: string | null
  sub_number: string | null
  location: string | null
  notes: string | null
  photo_url: string | null
  sth: boolean | null
  th: boolean | null
  chase: boolean | null
  qty: number | null
  favorite: boolean | null
}

const pageStyle: CSSProperties = dvAppPageShell

const containerStyle: CSSProperties = dvDashboardInner

const detailPanelStyle: CSSProperties = {
  background: t.surface,
  border: `1px solid ${dvCardOrangeBorder}`,
  borderRadius: t.radiusLg,
  padding: 16,
  marginBottom: 16,
  boxShadow: `0 0 18px ${dvOrangeGlowSubtle}, 0 10px 28px rgba(0,0,0,0.35)`,
}

const topBarStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  marginBottom: 20,
}

const ghostButtonStyle: CSSProperties = {
  ...dvGhostButton,
  background: "transparent",
  border: "none",
  boxShadow: "none",
  padding: 0,
  fontSize: 16,
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
  minWidth: 88,
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

const inputStyle: CSSProperties = {
  ...dvInput,
  flex: 1,
  minWidth: 0,
  maxWidth: 170,
  textAlign: "right",
  padding: "8px 10px",
  fontSize: 14,
}

const notesInputStyle: CSSProperties = {
  ...dvInput,
  width: "100%",
  minHeight: 90,
  resize: "vertical",
  fontFamily: dvBodyFont,
  boxSizing: "border-box",
  textAlign: "left",
}

export default function CarDetail() {
  const { id } = useParams()
  const router = useRouter()

  const [item, setItem] = useState<Item | null>(null)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadItem() {
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
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error(error)
        router.replace("/mygarage")
        return
      }

      setItem(data)
      setLoading(false)
    }

    loadItem()
  }, [id, router])

  async function handleDelete() {
    if (!item) return

    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", item.id)

    if (error) {
      console.error(error)
      alert("Error deleting item")
      return
    }

    router.push("/mygarage")
  }

  async function handleToggleFavorite() {
    if (!item) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const newValue = !item.favorite

      const { error } = await supabase
        .from("items")
        .update({ favorite: newValue })
        .eq("id", item.id)

      if (error) {
        console.error(error)
        return
      }

      setItem((prev) => (prev ? { ...prev, favorite: newValue } : prev))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSave() {
    if (!editItem) return

    const qtyValue =
      editItem.qty === null || editItem.qty === undefined || editItem.qty === ("" as never)
        ? null
        : Number(editItem.qty)

    const { data, error } = await supabase
      .from("items")
      .update({
        brand: editItem.brand?.trim() || null,
        name: editItem.name?.trim() || null,
        color: editItem.color?.trim() || null,
        scale: editItem.scale?.trim() || null,
        qty: Number.isNaN(qtyValue) ? null : qtyValue,
        main_number: editItem.main_number?.trim() || null,
        sub_number: editItem.sub_number?.trim() || null,
        series: editItem.series?.trim() || null,
        year: editItem.year?.trim() || null,
        location: editItem.location?.trim() || null,
        notes: editItem.notes?.trim() || null,
      })
      .eq("id", editItem.id)
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    setItem(data)
    setEditItem(data)
    setIsEditing(false)
  }

  if (loading) {
    return <FullPageLoading label="Loading diecast..." />
  }

  if (!item) {
    return null
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={topBarStyle}>
          <button
            onClick={() => router.push("/mygarage")}
            style={{
              ...ghostButtonStyle,
              justifySelf: "start",
            }}
          >
            Back
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.06)",
              color: "#f87171",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              justifySelf: "center",
            }}
          >
            Delete
          </button>

          <div
            style={{
              justifySelf: "end",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <button onClick={handleToggleFavorite} style={ghostButtonStyle}>
              {item.favorite ? "⭐ Favorited" : "☆ Favorite"}
            </button>

            <button
              onClick={() => {
                if (!isEditing) {
                  setEditItem({ ...item })
                  setIsEditing(true)
                } else {
                  setEditItem(null)
                  setIsEditing(false)
                }
              }}
              style={ghostButtonStyle}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            {isEditing && (
              <button onClick={handleSave} style={ghostButtonStyle}>
                Save
              </button>
            )}
          </div>
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
            boxShadow:
              "0 0 20px rgba(255,106,0,0.13), 0 10px 28px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,106,0,0.44)",
          }}
        >
          {item.photo_url && (
            <img
              src={item.photo_url}
              alt={item.name || "Diecast"}
              onClick={() => setShowImageModal(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
                display: "block",
              }}
            />
          )}
        </div>

        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div
            style={{
              fontFamily: dvDisplayFont,
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 6,
              letterSpacing: "-0.03em",
              color: t.textPrimary,
            }}
          >
            {item.name ?? "Unnamed model"}
          </div>

          <div
            style={{
              color: t.textSecondary,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {item.brand ?? "Unknown brand"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          {item.sth && (
            <span
              style={{
                background: "#f59e0b",
                color: "#000",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
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
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
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
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Chase
            </span>
          )}
        </div>

        <div style={detailPanelStyle}>
          <div style={rowStyle}>
            <span style={labelStyle}>Brand</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.brand || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, brand: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.brand ?? "-"}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Model</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.name || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.name ?? "-"}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Color</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.color || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, color: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.color ?? "-"}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Scale</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.scale || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, scale: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.scale ?? "-"}</span>
            )}
          </div>

          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>Qty</span>
            {isEditing ? (
              <input
                type="number"
                value={editItem?.qty ?? ""}
                onChange={(e) =>
                  setEditItem((prev) =>
                    prev
                      ? {
                          ...prev,
                          qty: e.target.value === "" ? null : Number(e.target.value),
                        }
                      : prev
                  )
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.qty ?? 1}</span>
            )}
          </div>
        </div>

        <div style={detailPanelStyle}>
          <div style={rowStyle}>
            <span style={labelStyle}>Number</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.main_number || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, main_number: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.main_number ?? "-"}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Subnumber</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.sub_number || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, sub_number: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.sub_number ?? "-"}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Series</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.series || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, series: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.series ?? "-"}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Year</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.year || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, year: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.year ?? "-"}</span>
            )}
          </div>

          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>Location</span>
            {isEditing ? (
              <input
                type="text"
                value={editItem?.location || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, location: e.target.value } : prev))
                }
                style={inputStyle}
              />
            ) : (
              <span style={valueStyle}>{item.location ?? "-"}</span>
            )}
          </div>
        </div>

        {(isEditing || item.notes) && (
          <div style={{ ...detailPanelStyle, marginBottom: 0 }}>
            <div style={{ color: t.textMuted, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Notes
            </div>

            {isEditing ? (
              <textarea
                value={editItem?.notes || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
                }
                style={notesInputStyle}
              />
            ) : (
              <div style={{ lineHeight: 1.5, wordBreak: "break-word" }}>
                {item.notes}
              </div>
            )}
          </div>
        )}

        {showImageModal && (
          <div
            onClick={() => setShowImageModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
              padding: 20,
            }}
          >
            <img
              src={item.photo_url || ""}
              alt={item.name || "Diecast"}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: t.radiusMd,
              }}
            />
          </div>
        )}

        {showDeleteModal && (
          <div
            onClick={() => setShowDeleteModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: t.surface,
                padding: 20,
                borderRadius: t.radiusLg,
                border: `1px solid ${dvCardOrangeBorder}`,
                boxShadow: `0 0 18px ${dvOrangeGlowSubtle}, 0 10px 28px rgba(0,0,0,0.35)`,
                textAlign: "center",
                maxWidth: 300,
                width: "100%",
              }}
            >
              <p style={{ marginBottom: 20, color: t.textPrimary }}>
                Delete this diecast?
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    ...dvGhostButton,
                    flex: 1,
                    padding: "10px",
                    borderRadius: t.radiusMd,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: t.radiusMd,
                    background: "#ef4444",
                    color: "#fff",
                    border: "1px solid rgba(239,68,68,0.45)",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}