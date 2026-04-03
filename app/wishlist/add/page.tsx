"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const SCALE_OPTIONS = [
  "1:64",
  "1:43",
  "1:24",
  "1:18",
  "1:87",
  "1:50",
  "Other",
];

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#0f0f0f",
  color: "#fff",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  padding: 20,
};

const containerStyle: CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#171717",
  color: "#fff",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(59,130,246,0.35)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
};

const disabledButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "rgba(255,255,255,0.08)",
  cursor: "not-allowed",
};

const priorityButtonBase: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  cursor: "pointer",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#171717",
  fontSize: 15,
  fontWeight: 600,
};

async function compressImage(file: File) {
  return new Promise<File>((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          resolve(
            new File([blob!], file.name.replace(/\.\w+$/, ".jpg"), {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        0.7
      );
    };

    img.src = URL.createObjectURL(file);
  });
}

export default function AddWishlistPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [scale, setScale] = useState("1:64");
  const [customScale, setCustomScale] = useState("");
  const [mainNumber, setMainNumber] = useState("");
  const [subNumber, setSubNumber] = useState("");
  const [series, setSeries] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setMessage(null);
    setErrorMessage(null);
    setImageFile(file);

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const resetForm = () => {
    setModel("");
    setBrand("");
    setColor("");
    setScale("1:64");
    setCustomScale("");
    setMainNumber("");
    setSubNumber("");
    setSeries("");
    setYear("");
    setNotes("");
    setPriority("medium");
    setImageFile(null);

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      setErrorMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMessage("You must be logged in.");
        return;
      }

      if (!brand.trim()) {
        setErrorMessage("Please enter the brand.");
        return;
      }

      if (!model.trim()) {
        setErrorMessage("Please enter the model.");
        return;
      }

      let photo_url: string | null = null;

      if (imageFile) {
        const compressedFile = await compressImage(imageFile);
        const ext = compressedFile.name.split(".").pop() || "jpg";
        const fileName = `wishlist-${user.id}-${Date.now()}.${ext}`;
        const filePath = `wishlist/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("captures")
          .upload(filePath, compressedFile);

        if (uploadError) {
          console.error("UPLOAD ERROR FULL:", uploadError);
          setErrorMessage(
            `Upload error: ${uploadError.message || JSON.stringify(uploadError)}`
          );
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("captures")
          .getPublicUrl(filePath);

        photo_url = publicUrlData.publicUrl;
      }

      const finalScale =
        scale === "Other" ? customScale.trim() || null : scale.trim() || null;

      const { error } = await supabase.from("wishlist").insert([
        {
          user_id: user.id,
          photo_url,
          name: model.trim(),
          brand: brand.trim() || null,
          color: color.trim() || null,
          scale: finalScale,
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
        setErrorMessage(`DB error: ${error.message || JSON.stringify(error)}`);
        return;
      }

      setMessage("Wishlist item saved successfully ✅");
      resetForm();

      setTimeout(() => {
        router.push("/wishlist");
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <img
            src="/logo.png"
            alt="My Diecast Garage"
            style={{
              width: 120,
              height: "auto",
              display: "block",
            }}
          />
        </div>

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

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
          }}
        >
          <h1 style={{ margin: 0, marginBottom: 8, fontSize: 30 }}>
            Add Wishlist Item
          </h1>

          <p style={{ marginTop: 0, marginBottom: 22, opacity: 0.8 }}>
            Save a diecast you want to find later.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.removeAttribute("capture");
                  fileInputRef.current.click();
                }
              }}
              disabled={saving}
              style={
                saving
                  ? {
                      ...disabledButtonStyle,
                      padding: "12px 14px",
                      fontSize: 15,
                    }
                  : {
                      ...buttonStyle,
                      padding: "12px 14px",
                      fontSize: 15,
                    }
              }
            >
              Upload image
            </button>

            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.setAttribute("capture", "environment");
                  fileInputRef.current.click();
                }
              }}
              disabled={saving}
              style={
                saving
                  ? {
                      ...disabledButtonStyle,
                      padding: "12px 14px",
                      fontSize: 15,
                    }
                  : {
                      ...buttonStyle,
                      padding: "12px 14px",
                      fontSize: 15,
                    }
              }
            >
              Take pic
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={saving}
              style={{ display: "none" }}
            />
          </div>

          {saving && (
            <p style={{ marginTop: 0, marginBottom: 18, opacity: 0.85 }}>
              Saving wishlist item...
            </p>
          )}

          {previewUrl && (
            <div style={{ marginBottom: 20 }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxWidth: 320,
                  borderRadius: 14,
                  display: "block",
                }}
              />
            </div>
          )}

          {message && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(46, 160, 67, 0.15)",
                border: "1px solid rgba(46, 160, 67, 0.35)",
                color: "#c8ffd7",
              }}
            >
              {message}
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255, 80, 80, 0.12)",
                border: "1px solid rgba(255, 80, 80, 0.28)",
                color: "#ffd0d0",
              }}
            >
              {errorMessage}
            </div>
          )}

          <div style={{ display: "grid", gap: 12 }}>
            <input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            <select
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              disabled={saving}
              style={inputStyle}
            >
              {SCALE_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  style={{ background: "#171717", color: "#fff" }}
                >
                  {option}
                </option>
              ))}
            </select>

            {scale === "Other" && (
              <input
                type="text"
                placeholder="Enter custom scale"
                value={customScale}
                onChange={(e) => setCustomScale(e.target.value)}
                disabled={saving}
                style={inputStyle}
              />
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setPriority("high")}
                disabled={saving}
                style={{
                  ...priorityButtonBase,
                  background:
                    priority === "high" ? "rgba(255,0,0,0.16)" : "#171717",
                  border:
                    priority === "high"
                      ? "1px solid rgba(255,0,0,0.45)"
                      : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                🔴 High
              </button>

              <button
                type="button"
                onClick={() => setPriority("medium")}
                disabled={saving}
                style={{
                  ...priorityButtonBase,
                  background:
                    priority === "medium"
                      ? "rgba(255,215,0,0.16)"
                      : "#171717",
                  border:
                    priority === "medium"
                      ? "1px solid rgba(255,215,0,0.45)"
                      : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                🟡 Medium
              </button>

              <button
                type="button"
                onClick={() => setPriority("low")}
                disabled={saving}
                style={{
                  ...priorityButtonBase,
                  background:
                    priority === "low"
                      ? "rgba(50,205,50,0.16)"
                      : "#171717",
                  border:
                    priority === "low"
                      ? "1px solid rgba(50,205,50,0.45)"
                      : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                🟢 Low
              </button>
            </div>

            <input
              type="text"
              placeholder="Main number"
              value={mainNumber}
              onChange={(e) => setMainNumber(e.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Sub number"
              value={subNumber}
              onChange={(e) => setSubNumber(e.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              disabled={saving}
              style={{
                ...inputStyle,
                minHeight: 110,
                resize: "vertical",
              }}
            />

            <button
              onClick={handleSave}
              disabled={saving}
              style={saving ? disabledButtonStyle : buttonStyle}
            >
              {saving ? "Saving..." : "Save Wishlist Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}