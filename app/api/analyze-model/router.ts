import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({
    model: "Porsche 911 GT3 RS",
  })
}