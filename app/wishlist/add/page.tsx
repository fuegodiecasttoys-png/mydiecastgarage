"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const cardStyle = {
  width: "100%",
  maxWidth: 520,
  margin: "0 auto",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#111",
  color: "#fff",
  fontSize: 15,
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 600,
  opacity: 0.9,
};

export default function AddWishlistPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [scale, setScale] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);

      let photo_url: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const fileName = `wishlist-${Date.now()}.${ext}`;
        const filePath = `wishlist/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("car-photos")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("car-photos")
          .getPublicUrl(filePath);

        photo_url = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("wishlist").insert([
        {
          name: name.trim(),
          brand: brand.trim() || null,
          scale: scale.trim() || null,
          notes: notes.trim() || null,
          priority,
          photo_url,
        },
      ]);

      if (error) {
        throw error;
      }

      router.push("/wishlist");
    } catch (err) {
      console.error(err);
      alert("Could not save wishlist item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        padding: 20,
        color: "#fff",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <a
        href="/wishlist"
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          fontSize: 20,
          textDecoration: "none",
          color: "white",
          zIndex: 999,
        }}
      >
        🏠
      </a>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 30,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800 }}>+ Add Wishlist Item</div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={labelStyle}>Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ ...inputStyle, padding: 10 }}
            />

            {previewUrl && (
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#181818",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 260,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nissan Skyline R34"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Brand</label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Hot Wheels"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Scale</label>
            <input
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              placeholder="1:64"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Blue, premium, chase maybe..."
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: 110,
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>Priority</label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setPriority("high")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "#fff",
                  background: priority === "high" ? "rgba(255,0,0,0.16)" : "#111",
                  border:
                    priority === "high"
                      ? "2px solid red"
                      : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                🔴 High
              </button>

              <button
                type="button"
                onClick={() => setPriority("medium")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "#fff",
                  background:
                    priority === "medium" ? "rgba(255,215,0,0.16)" : "#111",
                  border:
                    priority === "medium"
                      ? "2px solid gold"
                      : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                🟡 Medium
              </button>

              <button
                type="button"
                onClick={() => setPriority("low")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "#fff",
                  background:
                    priority === "low" ? "rgba(50,205,50,0.16)" : "#111",
                  border:
                    priority === "low"
                      ? "2px solid limegreen"
                      : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                🟢 Low
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: saving ? "#222" : "#fff",
              color: saving ? "#aaa" : "#111",
              fontSize: 16,
              fontWeight: 800,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Wishlist Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
