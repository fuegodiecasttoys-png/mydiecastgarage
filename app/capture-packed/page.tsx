"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react"
import { supabase } from "../lib/supabaseClient"

const FREE_LIMIT = 20

const SCALE_OPTIONS = [
  "1:64",
  "1:43",
  "1:24",
  "1:18",
  "1:87",
  "1:50",
  "Other",
]

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#0f0f0f",
  color: "#fff",
  fontFamily: "system-ui",
  padding: 20,
}

const containerStyle: CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#171717",
  color: "#fff",
  fontSize: 15,
  outline: "none",
}

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
}

const disabledButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "rgba(255,255,255,0.08)",
  cursor: "not-allowed",
}

export default function CapturePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [color, setColor] = useState("")
  const [scale, setScale] = useState("1:64")
  const [customScale, setCustomScale] = useState("")

  const [qty, setQty] = useState(1)

  const [sth, setSth] = useState(false)
  const [th, setTh] = useState(false)
  const [chase, setChase] = useState(false)

  const [mainNumber, setMainNumber] = useState("")
  const [subNumber, setSubNumber] = useState("")
  const [series, setSeries] = useState("")
  const [year, setYear] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  const [loading, setLoading] = useState(false)
  const [monthlyCount, setMonthlyCount] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const remaining = useMemo(
    () => Math.max(0, FREE_LIMIT - monthlyCount),
    [monthlyCount]
  )

  const locked = monthlyCount >= FREE_LIMIT

  useEffect(() => {
    void fetchMonthlyCount()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function fetchMonthlyCount() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count, error } = await supabase
      .from("captures")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString())

    if (!error && count != null) {
      setMonthlyCount(count)
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null

    setMessage(null)
    setErrorMessage(null)

    if (!selectedFile) {
      setFile(null)

      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }

      setPreviewUrl(null)
      return
    }

    setFile(selectedFile)

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    const localPreview = URL.createObjectURL(selectedFile)
    setPreviewUrl(localPreview)
  }

  function resetForm() {
    setName("")
    setBrand("")
    setColor("")
    setScale("1:64")
    setQty(1)

    setSth(false)
    setTh(false)
    setChase(false)

    setMainNumber("")
    setSubNumber("")
    setSeries("")
    setYear("")
    setLocation("")
    setNotes("")

    setFile(null)

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSave() {
    try {
      setLoading(true)
      setMessage(null)
      setErrorMessage(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setErrorMessage("You must be logged in.")
        return
      }

      if (monthlyCount >= FREE_LIMIT) {
        setErrorMessage("Free limit reached (20/month). Upgrade to Pro.")
        return
      }

      if (!file) {
        setErrorMessage("Please select a photo first.")
        return
      }

      if (!name.trim()) {
        setErrorMessage("Please enter the model name.")
        return
      }

      if (!brand.trim()) {
        setErrorMessage("Please enter the brand.")
        return
      }

      if (qty < 1) {
        setErrorMessage("Quantity must be at least 1.")
        return
      }

      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("captures")
        .upload(fileName, file)

      if (uploadError) {
        console.error(uploadError)
        setErrorMessage("Upload failed.")
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from("captures")
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl

      const { error: captureError } = await supabase.from("captures").insert({
        user_id: user.id,
        photo_url: publicUrl,
      })

      if (captureError) {
        console.error(captureError)
        setErrorMessage("Image uploaded, but failed to save capture record.")
        return
      }

      const { error: itemError } = await supabase.from("items").insert({
        user_id: user.id,
        photo_url: publicUrl,

        name: name.trim(),
        brand: brand.trim(),
        color: color.trim() || null,
        scale: scale.trim() || null,
        qty,

        sth,
        th,
        chase,

        main_number: mainNumber.trim() || null,
        sub_number: subNumber.trim() || null,
        series: series.trim() || null,
        year: year.trim() || null,
        location: location.trim() || null,
        type: 'packed',
        notes: notes.trim() || null,
      })

      if (itemError) {
        console.error(itemError)
        setErrorMessage("Image uploaded, but failed to create diecast item.")
        return
      }

      await fetchMonthlyCount()
      setMessage("Diecast saved successfully ✅")
      resetForm()
    } catch (err) {
      console.error(err)
      setErrorMessage("Unexpected error.")
    } finally {
      setLoading(false)
    }
  }

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

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
          }}
        >
          <h1 style={{ margin: 0, marginBottom: 8, fontSize: 30 }}>
            Upload Diecast Photo
          </h1>

          <p style={{ margin: 0, marginBottom: 6, opacity: 0.9 }}>
            Captures this month: <strong>{monthlyCount}</strong> / {FREE_LIMIT}
          </p>

          <p style={{ marginTop: 0, marginBottom: 22, opacity: 0.8 }}>
            {locked ? (
              <span style={{ color: "#ffb020" }}>
                Limit reached. Upgrade to Pro to keep capturing 💎
              </span>
            ) : (
              <span>
                Remaining this month: <strong>{remaining}</strong>
              </span>
            )}
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
                  fileInputRef.current.removeAttribute("capture")
                  fileInputRef.current.click()
                }
              }}
              disabled={locked || loading}
              style={
                locked || loading
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
                  fileInputRef.current.setAttribute("capture", "environment")
                  fileInputRef.current.click()
                }
              }}
              disabled={locked || loading}
              style={
                locked || loading
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
              onChange={handleFileChange}
              disabled={locked || loading}
              style={{ display: "none" }}
            />
          </div>

          {loading && (
            <p style={{ marginTop: 0, marginBottom: 18, opacity: 0.85 }}>
              Saving diecast...
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
              placeholder="Model"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <select
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              disabled={loading || locked}
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
    disabled={loading || locked}
    style={inputStyle}
  />
)}


            <input
              type="number"
              min={1}
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginTop: 2,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#171717",
                }}
              >
                <input
                  type="checkbox"
                  checked={sth}
                  onChange={(e) => setSth(e.target.checked)}
                  disabled={loading || locked}
                />
                STH
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#171717",
                }}
              >
                <input
                  type="checkbox"
                  checked={th}
                  onChange={(e) => setTh(e.target.checked)}
                  disabled={loading || locked}
                />
                TH
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#171717",
                }}
              >
                <input
                  type="checkbox"
                  checked={chase}
                  onChange={(e) => setChase(e.target.checked)}
                  disabled={loading || locked}
                />
                Chase
              </label>
            </div>

            <input
              type="text"
              placeholder="Main number"
              value={mainNumber}
              onChange={(e) => setMainNumber(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Sub number"
              value={subNumber}
              onChange={(e) => setSubNumber(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading || locked}
              style={inputStyle}
            />

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              disabled={loading || locked}
              style={{
                ...inputStyle,
                minHeight: 110,
                resize: "vertical",
              }}
            />

            <button
              onClick={handleSave}
              disabled={loading || locked}
              style={loading || locked ? disabledButtonStyle : buttonStyle}
            >
              {loading ? "Saving..." : "Save Diecast"}
            </button>
          </div>

          {locked && (
            <div style={{ marginTop: 20 }}>
              <button
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(59,130,246,0.35)",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => alert("Upgrade screen later 😊")}
              >
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
