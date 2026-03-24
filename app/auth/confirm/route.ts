import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as "email",
  });

  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }

  return NextResponse.redirect(`${origin}`);
}
