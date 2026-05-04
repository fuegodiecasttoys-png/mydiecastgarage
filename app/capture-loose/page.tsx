"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";

import { compressImage } from "../lib/compressImage";
import { fetchProfile, isActiveProRow } from "../lib/fetchProfile";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRANDS, COLORS } from "../lib/constants"
import { DvAutocompleteInput } from "../components/DvAutocompleteInput"
import { FullPageLoading } from "../components/FullPageLoading"
import { t } from "../ui/dv-tokens"
import {
  dvAppPageShell,
  dvDashboardInner,
  dvInput,
  dvPrimaryButton,
  dvPrimaryButtonDisabled,
} from "../ui/dv-visual"

const SCALE_OPTIONS = [
  "1:64",
  "1:43",
  "1:24",
  "1:18",
  "1:87",
  "1:50",
  "Other",
]

const pageStyle: CSSProperties = dvAppPageShell
const containerStyle: CSSProperties = dvDashboardInner
const inputStyle: CSSProperties = { ...dvInput, outline: "none" }
const buttonStyle: CSSProperties = dvPrimaryButton
const disabledButtonStyle: CSSProperties = dvPrimaryButtonDisabled

export default function CapturePage() {
  const router = useRouter();
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
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [planStatus, setPlanStatus] = useState<{
    plan: string | null
    is_active: boolean | null
  } | null>(null)

  const loadPlanProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const row = await fetchProfile(user.id, "plan, is_active")
    if (!row) {
      setPlanStatus(null)
      return
    }
    setPlanStatus({
      plan: typeof row.plan === "string" ? row.plan : null,
      is_active:
        row.is_active === true ? true : row.is_active === false ? false : null,
    })
  }, [])

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setSessionChecked(true)
    }

    void init()
  }, [router])

  useEffect(() => {
    if (!sessionChecked) return
    void loadPlanProfile()
    const handleFocus = () => {
      void loadPlanProfile()
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [sessionChecked, loadPlanProfile])
  
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

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
    setCustomScale("")
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan, is_active, monthly_captures, last_capture_reset")
        .eq("user_id", user.id)
        .single()

      if (!isActiveProRow(profile)) {
        const today = new Date()
        const lastReset = profile?.last_capture_reset
          ? new Date(profile.last_capture_reset)
          : null

        const isNewMonth =
          !lastReset ||
          lastReset.getMonth() !== today.getMonth() ||
          lastReset.getFullYear() !== today.getFullYear()

        let currentCaptures = profile?.monthly_captures || 0

        if (isNewMonth) {
          currentCaptures = 0

          await supabase
            .from("profiles")
            .update({
              monthly_captures: 0,
              last_capture_reset: today.toISOString(),
            })
            .eq("user_id", user.id)
        }

        if (currentCaptures >= 30) {
          alert("Free plan limit reached (30 per month). Upgrade to Pro 🚀")
          return
        }
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
      const compressedFile = await compressImage(file)

      const { error: uploadError } = await supabase.storage
        .from("captures")
        .upload(fileName, compressedFile)

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

      const { data: possibleMatches } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .eq("brand", brand.trim())
        .eq("name", name.trim())
        .eq("type", "loose")
        .limit(5)

      if (possibleMatches && possibleMatches.length > 0) {
        localStorage.setItem("matches", JSON.stringify(possibleMatches))

        localStorage.setItem(
          "newItem",
          JSON.stringify({
            user_id: user.id,
            photo_url: publicUrl,
            name: name.trim(),
            brand: brand.trim(),
            color: color.trim() || null,
            scale: (scale === "Other" ? customScale : scale).trim() || null,
            qty,
            sth,
            th,
            chase,
            main_number: mainNumber.trim() || null,
            sub_number: subNumber.trim() || null,
            series: series.trim() || null,
            year: year.trim() || null,
            location: location.trim() || null,
            type: "loose",
            notes: notes.trim() || null,
          })
        )

        router.push("/matches")
        return
      }

      const { error: itemError } = await supabase.from("items").insert({
        user_id: user.id,
        photo_url: publicUrl,
        name: name.trim(),
        brand: brand.trim(),
        color: color.trim() || null,
        scale: (scale === "Other" ? customScale : scale).trim() || null,
        qty,
        sth,
        th,
        chase,
        main_number: mainNumber.trim() || null,
        sub_number: subNumber.trim() || null,
        series: series.trim() || null,
        year: year.trim() || null,
        location: location.trim() || null,
        type: "loose",
        notes: notes.trim() || null,
      })

      if (itemError) {
        console.error(itemError)
        setErrorMessage("Image uploaded, but failed to create diecast item.")
        return
      }

      if (!isActiveProRow(profile)) {
        await supabase
          .from("profiles")
          .update({
            monthly_captures: (profile?.monthly_captures || 0) + 1,
            last_capture_reset: new Date().toISOString(),
          })
          .eq("user_id", user.id)
      }

      setMessage("Diecast saved successfully ✅")
      resetForm()
      router.push("/mygarage")
    } catch (err) {
      console.error(err)
      setErrorMessage("Unexpected error.")
    } finally {
      setLoading(false)
    }
  }

  if (!sessionChecked) {
    return <FullPageLoading label="Loading..." />
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

        <Link
          href="/"
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
        </Link>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
          }}
        >
          <h1 style={{ margin: 0, marginBottom: 8, fontSize: 30 }}>
            Upload Diecast Photo
          </h1>

          <p style={{ margin: 0, marginBottom: 22, opacity: 0.8, lineHeight: 1.45 }}>
            Add a photo of your loose diecast, then enter the details below.
          </p>

          {isActiveProRow(planStatus) ? (
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 12,
                fontWeight: 700,
                color: t.textSecondary,
                textAlign: "center",
              }}
            >
              Pro plan active — unlimited monthly adds
            </p>
          ) : null}

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
              disabled={loading}
              style={
                loading
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
              disabled={loading}
              style={
                loading
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
              disabled={loading}
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
                background: "rgba(255, 122, 24, 0.1)",
                border: "1px solid rgba(255, 122, 24, 0.25)",
                color: t.textPrimary,
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
            <DvAutocompleteInput
              options={BRANDS}
              placeholder="Brand"
              value={brand}
              onChange={setBrand}
              disabled={loading}
              inputStyle={inputStyle}
            />

            <DvAutocompleteInput
              options={[]}
              placeholder="Model"
              value={name}
              onChange={setName}
              disabled={loading}
              inputStyle={inputStyle}
            />

            <DvAutocompleteInput
              options={COLORS}
              placeholder="Color (type 1–2 letters for suggestions)"
              value={color}
              onChange={setColor}
              disabled={loading}
              inputStyle={inputStyle}
            />

            <select
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              disabled={loading}
              style={inputStyle}
            >
              {SCALE_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  style={{ background: t.surface, color: t.textPrimary }}
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
                disabled={loading}
                style={inputStyle}
              />
            )}

            <input
              type="number"
              min={1}
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
              disabled={loading}
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
                  background: t.surface,
                }}
              >
                <input
                  type="checkbox"
                  checked={sth}
                  onChange={(e) => setSth(e.target.checked)}
                  disabled={loading}
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
                  background: t.surface,
                }}
              >
                <input
                  type="checkbox"
                  checked={th}
                  onChange={(e) => setTh(e.target.checked)}
                  disabled={loading}
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
                  background: t.surface,
                }}
              >
                <input
                  type="checkbox"
                  checked={chase}
                  onChange={(e) => setChase(e.target.checked)}
                  disabled={loading}
                />
                Chase
              </label>
            </div>

            <input
              type="text"
              placeholder="Main number"
              value={mainNumber}
              onChange={(e) => setMainNumber(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Sub number"
              value={subNumber}
              onChange={(e) => setSubNumber(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              disabled={loading}
              style={{
                ...inputStyle,
                minHeight: 110,
                resize: "vertical",
              }}
            />

            <button
              onClick={handleSave}
              disabled={loading}
              style={loading ? disabledButtonStyle : buttonStyle}
            >
              {loading ? "Saving..." : "Save Diecast"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}