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
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
  <button
  onClick={() => {
    if (!isEditing && item) {
      setEditItem(item)
    }
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

      <div
  style={{
    width: "100%",
    maxWidth: 200,
    margin: "0 auto",
  }}
>
        
        {/* BACK */}
        <button
          onClick={() => router.push("/mygarage")}
          style={{
            marginBottom: 20,
            background: "none",
            border: "none",
            color: "#aaa",
            cursor: "pointer",
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>


        <div style={{ marginBottom: 12, width: "100%" }}>

  <div style={{ display: "flex", justifyContent: "space-between" }}>
   <span style={{ opacity: 0.6 }}>Brand</span>
    <span>{item.brand}</span>
  </div>

  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ opacity: 0.6 }}>Model</span>
    {isEditing ? (
  <input
    type="text"
    value={editItem?.name || ""}
onChange={(e) =>
  setEditItem({ ...editItem!, name: e.target.value })
}
  />
) : (
  <span>{item.name}</span>
)}
  </div>

  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ opacity: 0.6 }}>Color</span>
    <span>{item.color}</span>
  </div>

  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ opacity: 0.6 }}>Scale</span>
    <span>{item.scale}</span>
  </div>

  <div style={{ display: "flex", justifyContent: "space-between" }}>
  <span style={{ opacity: 0.6 }}>Qty</span>
  <span>{item.qty ?? 1}</span>
</div>

</div>


        {/* ⭐ RAREZA */}
        <div style={{ marginBottom: 10 }}>
          {item.sth && <span style={{ color: "gold" }}>⭐ STH </span>}
          {item.th && <span style={{ color: "silver" }}>⭐ TH </span>}
          {item.chase && <span style={{ color: "orange" }}>⭐ Chase</span>}
        </div>

        {/* MODEL INFO */}
        <div style={{ marginBottom: 10 }}>
          <div>Number: {item.main_number}</div>
          <div>Subnumber: {item.sub_number}</div>
          <div>Series: {item.series}</div>
          <div>Year: {item.year}</div>
        </div>

        {/* EXTRA */}
        <div style={{ marginBottom: 10 }}>
          <div>Location: {item.location}</div>
        </div>

        {/* NOTES */}
        {item.notes && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ opacity: 0.6, marginBottom: 6 }}>
              Notes
            </div>
            <div>{item.notes}</div>
          </div>
        )}

      </div>
    </div>
  )
}