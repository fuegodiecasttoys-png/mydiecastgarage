import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient as createSupabaseServerClient } from "../../../lib/supabaseServer";

export async function POST() {
  try {
    console.log("Stripe checkout request started");

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripeProPriceId = process.env.STRIPE_PRO_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    console.log("Stripe env presence:", {
      STRIPE_SECRET_KEY: Boolean(stripeSecretKey),
      STRIPE_PRO_PRICE_ID: Boolean(stripeProPriceId),
      NEXT_PUBLIC_APP_URL: Boolean(appUrl),
    });

    if (!stripeSecretKey) {
      console.error("Missing STRIPE_SECRET_KEY");
      return Response.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    if (!stripeProPriceId) {
      console.error("Missing STRIPE_PRO_PRICE_ID");
      return Response.json({ error: "Missing STRIPE_PRO_PRICE_ID" }, { status: 500 });
    }

    if (!appUrl) {
      console.error("Missing NEXT_PUBLIC_APP_URL");
      return Response.json({ error: "Missing NEXT_PUBLIC_APP_URL" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-04-22.dahlia",
    });
    const supabase = await createSupabaseServerClient();
    const authHeader = headers().get("authorization");
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
      console.error("Checkout unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: stripeProPriceId,
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
      },
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/pro`,
    });

    console.log("Checkout session created:", session.id);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: "Checkout failed" }, { status: 500 });
  }
}
