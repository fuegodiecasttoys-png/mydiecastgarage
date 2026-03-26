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

  const [item, setItem] = useState<Item | null>(null)
  const [editItem, setEditItem] = useState<Item | null>(null)

  const handleSave = async () => {
    if (!editItem) return

    await supabase
      .from("items")
      .update({
        name: editItem.name,
        brand: editItem.brand,
        color: editItem.color,
      })
      .eq("id", editItem.id)

    setItem(editItem)
    setIsEditing(false)
  }

  useEffect(() => {
    const loadItem = async () => {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single()

      setItem(data)
    }

    loadItem()
  }, [id])

  if (!item) return null

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
      {/* BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => {
            if (!isEditing) setEditItem(item)
            setIsEditing(!isEditing)
          }}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>

        {isEditing && (
          <button onClick={handleSave}>
            Save
          </button>
        )}
      </div>

      {/* BACK */}
      <button
        onClick={() => router.push("/mygarage")}
        style={{ marginBottom: 20 }}
      >
        ← Back
      </button>

      {/* IMAGE */}
      <div style={{ marginBottom: 20 }}>
        {item.photo_url && (
          <img
            src={item.photo_url}
            style={{
              width: "100%",
              maxWidth: 200,
              borderRadius: 16,
            }}
          />
        )}
      </div>

      {/* BRAND */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ opacity: 0.6 }}>Brand</span>

        {isEditing ? (
          <input
            value={editItem?.brand || ""}
            onChange={(e) =>
              setEditItem({ ...editItem!, brand: e.target.value })
            }
          />
        ) : (
          <span>{item.brand}</span>
        )}
      </div>

      {/* NAME */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ opacity: 0.6 }}>Model</span>

        {isEditing ? (
          <input
            value={editItem?.name || ""}
            onChange={(e) =>
              setEditItem({ ...editItem!, name: e.target.value })
            }
          />
        ) : (
          <span>{item.name}</span>
        )}
      </div>

      {/* COLOR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ opacity: 0.6 }}>Color</span>

        {isEditing ? (
          <input
            value={editItem?.color || ""}
            onChange={(e) =>
              setEditItem({ ...editItem!, color: e.target.value })
            }
          />
        ) : (
          <span>{item.color}</span>
        )}
      </div>

      {/* SCALE */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ opacity: 0.6 }}>Scale</span>
        <span>{item.scale}</span>
      </div>

      {/* QTY */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ opacity: 0.6 }}>Qty</span>
        <span>{item.qty ?? 1}</span>
      </div>
    </div>
  )
}