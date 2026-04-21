import type { ReactNode } from "react"

export const dynamic = "force-dynamic"

export default function CaptureLooseLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
