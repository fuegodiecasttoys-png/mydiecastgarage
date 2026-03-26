"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

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
}

export default function CarDetail() {
  const [isEditing, setIsEditing] = useState(false)
  const { id } = useParams()
  const router = useRouter()
  const [showImageModal, setShowImageModal] = useState(false)

  const [item, setItem] = useState<Item | null>(null)
  const [editItem, setEditItem] = useState<Item | null>(null)

  const handleSave = async () => {
    if (!editItem) return

    const qtyValue =
      editItem.qty === null || editItem.qty === undefined || editItem.qty === ("" as any)
        ? null
        : Number(editItem.qty)

    const { data, error } = await supabase
      .from("items")
      .update({
        brand: editItem.brand,
        name: editItem.name,
        color: editItem.color,
        scale: editItem.scale,
        qty: Number.isNaN(qtyValue) ? null : qtyValue,
        main_number: editItem.main_number,
        sub_number: editItem.sub_number,
        series: editItem.series,
        year: editItem.year,
        location: editItem.location,
        notes: editItem.notes,
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

  useEffect(() => {
    const loadItem = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      setItem(data)
    }

    loadItem()
  }, [id])

  if (!item) return null

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    width: "100%",
  }

  const labelStyle: React.CSSProperties = {
    opacity: 0.6,
    minWidth: 88,
  }

  const valueStyle: React.CSSProperties = {
    textAlign: "right",
    flex: 1,
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    maxWidth: 150,
    background: "#111",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
    textAlign: "right",
  }

  const notesInputStyle: React.CSSProperties = {
    width: "100%",
    background: "#111",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 8,
    padding: "10px 12px",
    outline: "none",
    minHeight: 90,
    resize: "vertical",
    fontFamily: "system-ui",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#fff",
        padding: 20,
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "flex-start" }}>
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
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              padding: 0,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                padding: 0,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Save
            </button>
          )}
        </div>

        {/* BACK */}
        <button
          onClick={() => router.push("/mygarage")}
          style={{
            marginBottom: 20,
            background: "none",
            border: "none",
            color: "#aaa",
            cursor: "pointer",
            padding: 0,
            fontSize: 16,
          }}
        >
          ← Back
        </button>

        {/* IMAGE */}
        <div
          style={{
            width: "100%",
            maxWidth: 200,
            aspectRatio: "1",
            borderRadius: 16,
            overflow: "hidden",
            background: "#222",
            margin: "0 auto 20px",
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
  cursor: "pointer"
}}
            />
          )}
          </div>

        <div style={{ marginBottom: 12, width: "100%" }}>
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
              <span style={valueStyle}>{item.brand}</span>
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
              <span style={valueStyle}>{item.name}</span>
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
              <span style={valueStyle}>{item.color}</span>
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
              <span style={valueStyle}>{item.scale}</span>
            )}
          </div>

          <div style={rowStyle}>
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

        {/* RAREZA */}
        <div style={{ marginBottom: 14 }}>
          {item.sth && <span style={{ color: "gold", marginRight: 10 }}>⭐ STH</span>}
          {item.th && <span style={{ color: "silver", marginRight: 10 }}>⭐ TH</span>}
          {item.chase && <span style={{ color: "orange" }}>⭐ Chase</span>}
        </div>

        {/* MODEL INFO */}
        <div style={{ marginBottom: 14 }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Number:</span>
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
              <span style={valueStyle}>{item.main_number}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Subnumber:</span>
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
              <span style={valueStyle}>{item.sub_number}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Series:</span>
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
              <span style={valueStyle}>{item.series}</span>
            )}
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>Year:</span>
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
              <span style={valueStyle}>{item.year}</span>
            )}
          </div>
        </div>

        {/* EXTRA */}
        <div style={{ marginBottom: 14 }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Location:</span>
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
              <span style={valueStyle}>{item.location}</span>
            )}
          </div>
        </div>

        {/* NOTES */}
        {(isEditing || item.notes) && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ opacity: 0.6, marginBottom: 6 }}>Notes</div>

            {isEditing ? (
              <textarea
                value={editItem?.notes || ""}
                onChange={(e) =>
                  setEditItem((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
                }
                style={notesInputStyle}
              />
            ) : (
              <div>{item.notes}</div>
            )}
          </div>
        )}
        {showImageModal && (
  <div
    onClick={() => setShowImageModal(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}
  >
    <img
      src={item?.photo_url || ""}
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        borderRadius: 12
      }}
    />
  </div>
)}

      </div>
    </div>
  )
}
