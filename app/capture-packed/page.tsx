"use client"

console.log("BUILD VERSION: 99f6bf8")

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { compressImage, compressImageForAnalyze } from "../lib/compressImage"
import { fetchProfile, isActiveProRow } from "../lib/fetchProfile"
import { supabase } from "../lib/supabaseClient"
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
const inputStyle: CSSProperties = dvInput
const buttonStyle: CSSProperties = dvPrimaryButton
const disabledButtonStyle: CSSProperties = dvPrimaryButtonDisabled

const MAX_ANALYZE_UPLOAD_BYTES = Math.floor(3.5 * 1024 * 1024)
const MONTHLY_AI_SCAN_LIMIT = 50

function messageFromAnalyzeFailure(res: Response, bodyText: string): string {
  try {
    const parsed = JSON.parse(bodyText) as unknown
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const err = (parsed as { error?: unknown }).error
      if (typeof err === "string" && err.trim()) return err.trim()
    }
  } catch {}
  const t = bodyText.trim()
  if (t) return t.length > 500 ? `${t.slice(0, 500)}…` : t
  return `Analyze request failed (${res.status})`
}

function analyzeClientAlertMessage(err: unknown): string {
  if (err instanceof Error && err.message.trim()) return err.message.trim()
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message: unknown }).message
    if (typeof m === "string" && m.trim()) return m.trim()
  }
  if (typeof err === "string" && err.trim()) return err.trim()
  return "Failed to analyze image"
}

export default function CapturePage() {
  const router = useRouter()
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
  const [isPro, setIsPro] = useState(false)
  const [aiScansUsed, setAiScansUsed] = useState(0)
  const [aiCredits, setAiCredits] = useState(0)

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const row = await fetchProfile(
      user.id,
      "plan, is_active, monthly_ai_scans, ai_credits"
    )
    if (!row) {
      setIsPro(false)
      return
    }
    setIsPro(isActiveProRow(row))
    setAiScansUsed(
      typeof row.monthly_ai_scans === "number" ? row.monthly_ai_scans : 0
    )
    setAiCredits(
      typeof row.ai_credits === "number" ? row.ai_credits : 0
    )
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
    void loadProfile()
    const handleFocus = () => {
      void loadProfile()
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [sessionChecked, loadProfile])

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

  async function handleAnalyze() {
    if (!file) {
      alert("Select or upload an image first, then tap Analyze model.")
      return
    }

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
        .select("plan, is_active, monthly_ai_scans, ai_credits, last_ai_scan_reset")
        .eq("user_id", user.id)
        .single()

      if (!isActiveProRow(profile)) {
        router.push("/pro")
        return
      }

      const today = new Date()
      const lastReset = profile?.last_ai_scan_reset
        ? new Date(profile.last_ai_scan_reset)
        : null

      const isNewMonth =
        !lastReset ||
        lastReset.getMonth() !== today.getMonth() ||
        lastReset.getFullYear() !== today.getFullYear()

      let currentAiScans = profile?.monthly_ai_scans || 0
      const packCredits = profile?.ai_credits ?? 0

      if (isNewMonth) {
        currentAiScans = 0

        await supabase
          .from("profiles")
          .update({
            monthly_ai_scans: 0,
            last_ai_scan_reset: today.toISOString(),
          })
          .eq("user_id", user.id)
      }

      if (currentAiScans >= MONTHLY_AI_SCAN_LIMIT && packCredits <= 0) {
        alert(`You used your ${MONTHLY_AI_SCAN_LIMIT} Model scans this month 🚀`)
        router.push("/pro?scanPack=1")
        return
      }

      console.log("[analyze-model] client original image", {
        fileName: file.name,
        fileType: file.type,
        fileSizeBytes: file.size,
      })

      const compressedForAnalyze = await compressImageForAnalyze(file)

      console.log("[analyze-model] client compressed for analyze", {
        fileName: compressedForAnalyze.name,
        fileType: compressedForAnalyze.type,
        fileSizeBytes: compressedForAnalyze.size,
        originalBytes: file.size,
        compressedBytes: compressedForAnalyze.size,
      })

      if (compressedForAnalyze.size > MAX_ANALYZE_UPLOAD_BYTES) {
        alert("Image is still too large. Please choose a smaller photo.")
        return
      }

      console.log("[analyze-model] before reqId")
      const reqId =
        globalThis.crypto &&
        typeof globalThis.crypto.randomUUID === "function"
          ? globalThis.crypto.randomUUID()
          : `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      console.log("[analyze-model] after reqId", reqId)

      const analyzeEndpoint = new URL(
        "/api/analyze-model",
        window.location.origin
      ).href

      console.log("[analyze-model] client request id", reqId)
      console.log("[analyze-model] client before fetch", {
        analyzeEndpoint,
        reqId,
        formField: "file",
        origin: window.location.origin,
      })

      const formData = new FormData()
      formData.append("file", compressedForAnalyze)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch(analyzeEndpoint, {
        method: "POST",
        headers: {
          "x-analyze-request-id": reqId,
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: formData,
      })

      console.log("[analyze-model] client after fetch", {
        analyzeEndpoint,
        reqId,
        status: res.status,
        ok: res.ok,
      })

      const responseText = await res.text()
      console.log(
        "[analyze-model] client response",
        res.status,
        "body length",
        responseText.length
      )

      if (!res.ok) {
        const msg = messageFromAnalyzeFailure(res, responseText)
        console.error("[analyze-model] client non-OK:", res.status, msg)
        throw new Error(msg)
      }

      let data: {
        brand?: string | null
        model?: string | null
        series?: string | null
        main_number?: string | null
        sub_number?: string | null
        error?: string
      }

      try {
        data = JSON.parse(responseText) as typeof data
      } catch {
        console.error(
          "[analyze-model] client invalid JSON (success status)",
          responseText.slice(0, 300)
        )
        throw new Error("Invalid analyze response (not JSON)")
      }

      if (typeof data.error === "string" && data.error.trim()) {
        throw new Error(data.error.trim())
      }

      console.log("[analyze-model] client parsed payload", data)

      if (data.brand) setBrand(data.brand)
      if (data.model) setName(data.model)
      if (data.series) setSeries(data.series)
      if (data.main_number) setMainNumber(data.main_number)
      if (data.sub_number) setSubNumber(data.sub_number)

      // Keep UI responsive immediately after a successful analyze call.
      const usedCreditForAnalyze =
        currentAiScans >= MONTHLY_AI_SCAN_LIMIT && packCredits > 0
      const optimisticMonthlyAiScans = usedCreditForAnalyze
        ? currentAiScans
        : currentAiScans + 1
      const optimisticAiCredits = usedCreditForAnalyze
        ? Math.max(packCredits - 1, 0)
        : packCredits

      setAiScansUsed(optimisticMonthlyAiScans)
      setAiCredits(optimisticAiCredits)

      const { data: usageRow } = await supabase
        .from("profiles")
        .select("monthly_ai_scans, ai_credits")
        .eq("user_id", user.id)
        .single()

      if (usageRow) {
        const dbMonthlyAiScans = usageRow.monthly_ai_scans ?? 0
        const dbAiCredits = usageRow.ai_credits ?? 0

        if (
          dbMonthlyAiScans < optimisticMonthlyAiScans ||
          dbAiCredits < optimisticAiCredits
        ) {
          const usagePatch = usedCreditForAnalyze
            ? { ai_credits: optimisticAiCredits }
            : { monthly_ai_scans: optimisticMonthlyAiScans }

          const { error: usageUpdateError } = await supabase
            .from("profiles")
            .update({
              ...usagePatch,
              last_ai_scan_reset: new Date().toISOString(),
            })
            .eq("user_id", user.id)

          if (usageUpdateError) {
            console.error(
              "[analyze-model] client usage update failed",
              usageUpdateError.message
            )
          } else {
            setAiScansUsed(optimisticMonthlyAiScans)
            setAiCredits(optimisticAiCredits)
          }
        } else {
          setAiScansUsed(dbMonthlyAiScans)
          setAiCredits(dbAiCredits)
        }
      }

      console.log("[analyze-model] client form state after apply", {
        brand: data.brand ?? "(unchanged)",
        model: data.model ?? "(unchanged)",
        series: data.series ?? "(unchanged)",
        main_number: data.main_number ?? "(unchanged)",
        sub_number: data.sub_number ?? "(unchanged)",
      })
    } catch (err: unknown) {
      console.error("[analyze-model] client error", err)
      alert(analyzeClientAlertMessage(err))
    } finally {
      setLoading(false)
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

      const { data: possibleMatches } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .eq("brand", brand.trim())
        .eq("name", name.trim())
        .eq("type", "packed")
        .limit(5)

      if (possibleMatches && possibleMatches.length > 0) {
        const { error: captureError } = await supabase.from("captures").insert({
          user_id: user.id,
          photo_url: publicUrl,
        })

        if (captureError) {
          console.error(captureError)
          setErrorMessage("Image uploaded, but failed to save capture record.")
          return
        }

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
            type: "packed",
            notes: notes.trim() || null,
          })
        )

        router.push("/matches")
        return
      }

      const finalScale =
        scale === "Other" ? customScale.trim() || null : scale.trim() || null

      const { data: existingItem } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .eq("brand", brand.trim())
        .eq("name", name.trim())
        .eq("type", "packed")
        .maybeSingle()

      if (existingItem) {
        const { error: updateError } = await supabase
          .from("items")
          .update({
            qty: existingItem.qty + qty,
          })
          .eq("id", existingItem.id)

        if (updateError) {
          console.error(updateError)
          setErrorMessage("Failed to update quantity.")
          return
        }

        setMessage("Quantity updated ✅")
        resetForm()
        router.push("/mygarage")
        return
      }

      const { error: itemError } = await supabase.from("items").insert({
        user_id: user.id,
        photo_url: publicUrl,
        name: name.trim(),
        brand: brand.trim(),
        color: color.trim() || null,
        scale: finalScale,
        qty,
        sth,
        th,
        chase,
        main_number: mainNumber.trim() || null,
        sub_number: subNumber.trim() || null,
        series: series.trim() || null,
        year: year.trim() || null,
        location: location.trim() || null,
        type: "packed",
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
            Add a photo of the packaged diecast, then fill in or adjust the details below.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 12,
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
          </div>

          {isPro ? (
            <div
              style={{
                marginBottom: 8,
                padding: "8px 10px",
                borderRadius: 12,
                background: "rgba(255, 122, 24, 0.08)",
                border: "1px solid rgba(255, 122, 24, 0.25)",
                color: t.textSecondary,
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Model scans: {aiScansUsed} / 50
              {aiCredits > 0 ? ` (+${aiCredits} pack)` : ""}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => {
              if (!isPro) {
                router.push("/pro")
                return
              }

              void handleAnalyze()
            }}
            disabled={loading || !file}
            style={
              loading || !file
                ? {
                    ...disabledButtonStyle,
                    marginBottom: 12,
                    padding: "12px 14px",
                    fontSize: 15,
                  }
                : {
                    ...buttonStyle,
                    marginBottom: 12,
                    padding: "12px 14px",
                    fontSize: 15,
                  }
            }
          >
            🤖 Analyze model
            {!isPro && (
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Pro only
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            style={{ display: "none" }}
          />

          {loading && (
            <p style={{ marginTop: 0, marginBottom: 18, opacity: 0.85 }}>
              Working...
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
              placeholder="Main # — top right (e.g. 157/250)"
              value={mainNumber}
              onChange={(e) => setMainNumber(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Sub # — mid-right box (e.g. 9/10)"
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