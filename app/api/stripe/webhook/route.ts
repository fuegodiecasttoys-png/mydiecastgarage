import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  }
  if (!stripeWebhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }
  if (!supabaseUrl) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
  }
  if (!supabaseServiceRoleKey) {
    return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-04-22.dahlia",
  });

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id ?? session.client_reference_id;

    if (!userId) {
      console.error("Stripe webhook missing Supabase user id on session:", session.id);
      return NextResponse.json({ received: true });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const checkoutType = session.metadata?.checkout_type;

    if (checkoutType === "scan_pack") {
      const packScans = Number.parseInt(process.env.STRIPE_SCAN_PACK_CREDITS ?? "50", 10);
      const add = Number.isFinite(packScans) && packScans > 0 ? packScans : 50;

      const { data: row, error: selErr } = await supabaseAdmin
        .from("profiles")
        .select("bonus_ai_scans")
        .eq("user_id", userId)
        .maybeSingle();

      if (selErr) {
        console.error("Stripe webhook scan pack: read profile failed:", selErr);
        return NextResponse.json({ error: "Failed to read profile for scan pack" }, { status: 500 });
      }

      const currentBonus = typeof row?.bonus_ai_scans === "number" ? row.bonus_ai_scans : 0;
      const { error: upErr } = await supabaseAdmin
        .from("profiles")
        .update({ bonus_ai_scans: currentBonus + add })
        .eq("user_id", userId);

      if (upErr) {
        console.error("Failed to add scan pack credits from Stripe webhook:", upErr);
        return NextResponse.json({ error: "Failed to add scan pack credits" }, { status: 500 });
      }

      console.log("Added scan pack credits from Stripe webhook:", userId, add);
    } else {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ plan: "pro" })
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to update profile plan from Stripe webhook:", error);
        return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 });
      }

      console.log("Upgraded user to pro from Stripe webhook:", userId);
    }
  }

  return NextResponse.json({ received: true });
}
