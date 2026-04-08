import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File is required" },
      { status: 400 }
    )
  }

  return NextResponse.json({
    brand: "Hot Wheels",
    model: "Porsche 911 GT3 RS",
    color: "Green",
  })
}