"use client"

import Link from "next/link"

export default function ProPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white px-5 py-8">
      <div className="mx-auto max-w-md space-y-6">
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

          {/* 💥 SCAN PACK */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-sm text-gray-400">Need more scans?</p>
            <p className="mt-2 text-3xl font-bold">$0.99</p>
            <p className="text-sm text-gray-400">for 50 model scans</p>
          </div>

          <button
            onClick={() => {
              alert("Payment setup coming soon.")
            }}
            className="mt-7 w-full rounded-2xl bg-orange-500 py-4 font-bold text-black"
          >
            Subscribe to Pro
          </button>

          <button
            onClick={() => {
              alert("Scan packs coming soon.")
            }}
            className="mt-3 w-full rounded-2xl border border-white/20 py-3 font-semibold text-white"
          >
            Buy Scan Pack ($0.99)
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            Secure payment setup coming soon.
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