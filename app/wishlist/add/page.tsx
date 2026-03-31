"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

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

  const [model, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [scale, setScale] = useState("");
  const [mainNumber, setMainNumber] = useState("");
  const [subNumber, setSubNumber] = useState("");
  const [series, setSeries] = useState("");
  const [year, setYear] = useState("");
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
    if (!model.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in");
        return;
      }

      let photo_url: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const fileName = `wishlist-${user.id}-${Date.now()}.${ext}`;
        const filePath = `wishlist/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("captures")
          .upload(filePath, imageFile);

        if (uploadError) {
  console.error("UPLOAD ERROR FULL:", uploadError);
  alert(`Upload error: ${uploadError.message || JSON.stringify(uploadError)}`);
  return;
}

        const { data: publicUrlData } = supabase.storage
          .from("captures")
          .getPublicUrl(filePath);

        photo_url = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("wishlist").insert([
        {
          user_id: user.id,
          photo_url,
          model: model.trim(),
          brand: brand.trim() || null,
          color: color.trim() || null,
          scale: scale.trim() || null,
          main_number: mainNumber.trim() || null,
          sub_number: subNumber.trim() || null,
          series: series.trim() || null,
          year: year.trim() || null,
          notes: notes.trim() || null,
          priority,
        },
      ]);

      if (error) {
  console.error("WISHLIST INSERT ERROR:", error);
  alert(`DB error: ${error.message || JSON.stringify(error)}`);
  return;
}

      router.push("/wishlist");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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
      <button
        onClick={() => router.push("/wishlist")}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 18,
          cursor: "pointer",
          marginBottom: 20,
          padding: 0,
        }}
      >
        ← Back
      </button>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
  <img
    src="/logo.png"
    alt="My Diecast Garage logo"
    style={{
      width: 140,
      maxWidth: "60%",
      height: "auto",
      display: "block",
      margin: "0 auto",
      filter: "drop-shadow(0 0 18px rgba(30,144,255,0.18))",
    }}
  />
</div>
        <h1 style={{ marginBottom: 20 }}>+ Add Wishlist Item</h1>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={labelStyle}>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                ...inputStyle,
                padding: 10,
              }}
            />

            {previewUrl && (
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 14,
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
            <label style={labelStyle}>Model *</label>
            <input
              value={model}
              onChange={(e) => setName(e.target.value)}
            
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Brand</label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Color</label>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
            
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Scale</label>
            <input
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Main Number</label>
            <input
              value={mainNumber}
              onChange={(e) => setMainNumber(e.target.value)}
              
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Sub Number</label>
            <input
              value={subNumber}
              onChange={(e) => setSubNumber(e.target.value)}
              
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Series</label>
            <input
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Year</label>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
            
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            
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
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
