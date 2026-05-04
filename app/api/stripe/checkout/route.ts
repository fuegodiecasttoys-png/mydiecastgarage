import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient as createSupabaseServerClient } from "../../../lib/supabaseServer";

/** Default Stripe Price for the $0.99 scan pack; override with STRIPE_SCAN_PACK_PRICE_ID. */
const DEFAULT_SCAN_PACK_PRICE_ID = "price_1TT8MSGZxjPLLizkZ3b0UbrP";

type CheckoutLineItem = "pro" | "scan_pack";

function parseLineItem(bodyText: string): CheckoutLineItem {
  if (!bodyText.trim()) return "pro";
  try {
    const body = JSON.parse(bodyText) as { lineItem?: unknown };
    if (body.lineItem === "scan_pack") return "scan_pack";
  } catch {
    // ignore invalid JSON
  }
  return "pro";
}

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripeProPriceId = process.env.STRIPE_PRO_PRICE_ID;
    const stripeScanPackPriceId =
      process.env.STRIPE_SCAN_PACK_PRICE_ID?.trim() || DEFAULT_SCAN_PACK_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const bodyText = await req.text();
    const lineItem = parseLineItem(bodyText);

    if (!stripeSecretKey) {
      console.error("Stripe checkout: missing STRIPE_SECRET_KEY");
      return Response.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    if (!appUrl) {
      console.error("Stripe checkout: missing NEXT_PUBLIC_APP_URL");
      return Response.json({ error: "Missing NEXT_PUBLIC_APP_URL" }, { status: 500 });
    }

    if (lineItem === "pro" && !stripeProPriceId) {
      console.error("Stripe checkout: missing STRIPE_PRO_PRICE_ID");
      return Response.json({ error: "Missing STRIPE_PRO_PRICE_ID" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-04-22.dahlia",
    });
    const supabase = await createSupabaseServerClient();
    const authHeader = (await headers()).get("authorization");
    const bearerToken =
      authHeader && authHeader.toLowerCase().startsWith("bearer ")
        ? authHeader.slice(7).trim()
        : null;
    const {
      data: { user },
      error: authError,
    } = bearerToken
      ? await supabase.auth.getUser(bearerToken)
      : await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Stripe checkout: unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseMetadata = {
      supabase_user_id: user.id,
      checkout_type: lineItem === "scan_pack" ? "scan_pack" : "pro_subscription",
    } as const;

    const session =
      lineItem === "scan_pack"
        ? await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
              {
                price: stripeScanPackPriceId,
                quantity: 1,
              },
            ],
            client_reference_id: user.id,
            metadata: { ...baseMetadata },
            success_url: `${appUrl}/pro?scanPackThanks=1`,
            cancel_url: `${appUrl}/pro?scanPack=1`,
          })
        : await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
              {
                price: stripeProPriceId!,
                quantity: 1,
              },
            ],
            client_reference_id: user.id,
            metadata: { ...baseMetadata },
            subscription_data: {
              metadata: {
                supabase_user_id: user.id,
              },
            },
            success_url: `${appUrl}/success`,
            cancel_url: `${appUrl}/pro`,
          });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed:", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Checkout failed" }, { status: 500 });
  }
}
