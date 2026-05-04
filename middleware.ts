import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Apex host (no www). Must match production hostname Stripe uses for webhook URL. */
const APEX_HOST = "mydiecastgarage.app";
const CANONICAL_WWW_HOST = "www.mydiecastgarage.app";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/stripe/webhook")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const host = request.headers.get("host")?.split(":")[0] ?? "";

  if (host === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_WWW_HOST;
    return NextResponse.redirect(url, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
