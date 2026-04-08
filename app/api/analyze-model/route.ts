import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      name: file.name,
      type: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error("analyze-model error:", error)

    return NextResponse.json(
      { error: "Failed to read uploaded file" },
      { status: 500 }
    )
  }
}
