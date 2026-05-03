"use client"

import Link from "next/link"
import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "../lib/supabaseClient"

function ScanPackUrlEffects() {
  const searchParams = useSearchParams()
  const thanks = searchParams.get("scanPackThanks") === "1"
  const scrollToPack =
    searchParams.get("scanPack") === "1" || thanks

  useEffect(() => {
    if (!scrollToPack) return
    requestAnimationFrame(() => {
      document
        .getElementById("diecast-scan-pack")
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }, [scrollToPack])

  if (!thanks) return null

  return (
    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-100">
      Payment received — your pack of 50 model scans was added to your account.
    </div>
  )
}

export default function ProPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-5 py-8">
      <div className="mx-auto max-w-md space-y-6">
        <Suspense fallback={null}>
          <ScanPackUrlEffects />
        </Suspense>

        <Link href="/" className="text-sm text-gray-400">
          ← Back home
        </Link>

        <div className="rounded-3xl border border-orange-500/30 bg-[#0f172a] p-6 shadow-xl">
          <p className="text-sm font-semibold text-orange-400">
            My Diecast Garage Pro
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight">
            Unlock the full garage.
          </h1>

          <p className="mt-3 text-gray-300">
            Built for collectors who want more captures, model scan help, exports, and no limits.
          </p>

          <div className="mt-6 rounded-2xl bg-black/30 p-5 text-center">
            <p className="text-4xl font-bold">$3.99</p>
            <p className="text-sm text-gray-400">per month</p>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <p>✅ Unlimited manual captures</p>
            <p>✅ 50 Auto Model scans included every month</p>
            <p>✅ CSV export enabled</p>
            <p>✅ Unlimited favorites</p>
            <p>✅ Unlimited wishlist</p>
          </div>

          <button
            onClick={async () => {
              try {
                const {
                  data: { session },
                } = await supabase.auth.getSession()

                const res = await fetch("/api/stripe/checkout", {
                  method: "POST",
                  headers: session?.access_token
                    ? { Authorization: `Bearer ${session.access_token}` }
                    : undefined,
                })

                const data = await res.json()

                if (data.url) {
                  window.location.href = data.url
                } else if (res.status === 401) {
                  window.location.href = "/login"
                } else {
                  alert("Something went wrong")
                }
              } catch (err) {
                console.error(err)
                alert("Error starting checkout")
              }
            }}
            className="mt-7 w-full rounded-2xl bg-orange-500 py-4 font-bold text-black"
          >
            Subscribe to Pro
          </button>

          {/* 💥 SCAN PACK — anchor for /pro?scanPack=1 */}
          <div
            id="diecast-scan-pack"
            className="mt-6 scroll-mt-24 rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
          >
            <p className="text-sm text-gray-400">Need more scans?</p>
            <p className="mt-2 text-3xl font-bold">$0.99</p>
            <p className="text-sm text-gray-400">for 50 model scans</p>
          </div>

          <button
            onClick={async () => {
              try {
                const {
                  data: { session },
                } = await supabase.auth.getSession()

                const res = await fetch("/api/stripe/checkout", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(session?.access_token
                      ? { Authorization: `Bearer ${session.access_token}` }
                      : {}),
                  },
                  body: JSON.stringify({ lineItem: "scan_pack" }),
                })

                const data = await res.json()

                if (data.url) {
                  window.location.href = data.url
                } else if (res.status === 401) {
                  window.location.href = "/login"
                } else {
                  alert("Something went wrong")
                }
              } catch (err) {
                console.error(err)
                alert("Error starting checkout")
              }
            }}
            className="mt-3 w-full rounded-2xl border border-white/20 py-3 font-semibold text-white"
          >
            Buy Scan Pack ($0.99)
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            Secure payment powered by Stripe.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          <p className="font-semibold text-white">Free plan</p>
          <p className="mt-2">
            Free users get 30 manual captures per month. Auto model scans and exports are Pro features.
          </p>
        </div>
      </div>
    </main>
  )
}
