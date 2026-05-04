import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const PG_UNIQUE_VIOLATION = "23505";

function stripePackCredits(): number {
  const packScans = Number.parseInt(process.env.STRIPE_SCAN_PACK_CREDITS ?? "50", 10);
  return Number.isFinite(packScans) && packScans > 0 ? packScans : 50;
}

function fallbackStripePackUsername(userId: string): string {
  const hex = userId.replace(/-/g, "").toLowerCase().slice(0, 17);
  return `stripe_${hex}`.slice(0, 24);
}

async function tryClaimStripeEvent(
  admin: SupabaseClient,
  event: Stripe.Event,
  stripeSessionId: string | null
): Promise<{ claimed: boolean; claimError?: string }> {
  const { error } = await admin.from("stripe_processed_events").insert({
    stripe_event_id: event.id,
    stripe_session_id: stripeSessionId,
    type: event.type,
  });

  if (error?.code === PG_UNIQUE_VIOLATION) {
    return { claimed: false };
  }
  if (error) {
    return { claimed: false, claimError: error.message };
  }
  return { claimed: true };
}

async function releaseStripeEventClaim(admin: SupabaseClient, stripeEventId: string): Promise<void> {
  await admin.from("stripe_processed_events").delete().eq("stripe_event_id", stripeEventId);
}

async function applyBonusAiScans(
  admin: SupabaseClient,
  userId: string,
  nextTotal: number
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { data: updated, error: upErr } = await admin
    .from("profiles")
    .update({ bonus_ai_scans: nextTotal })
    .eq("user_id", userId)
    .select("user_id");

  if (upErr) {
    return { ok: false, reason: upErr.message };
  }
  if (!updated?.length) {
    return { ok: false, reason: "profile_update_affected_zero_rows" };
  }
  return { ok: true };
}

async function grantScanPackCredits(
  admin: SupabaseClient,
  userId: string,
  add: number
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { data: row, error: selErr } = await admin
    .from("profiles")
    .select("user_id, bonus_ai_scans")
    .eq("user_id", userId)
    .maybeSingle();

  if (selErr) {
    return { ok: false, reason: selErr.message };
  }

  if (row?.user_id) {
    const next = (typeof row.bonus_ai_scans === "number" ? row.bonus_ai_scans : 0) + add;
    return applyBonusAiScans(admin, userId, next);
  }

  const username = fallbackStripePackUsername(userId);
  const { error: insErr } = await admin.from("profiles").insert({
    user_id: userId,
    username,
    name: null,
    plan: "free",
    is_active: true,
    bonus_ai_scans: add,
  });

  if (!insErr) {
    const { data: confirm } = await admin
      .from("profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!confirm?.user_id) {
      return { ok: false, reason: "profile_insert_not_confirmed" };
    }
    return { ok: true };
  }

  const { data: row2 } = await admin
    .from("profiles")
    .select("user_id, bonus_ai_scans")
    .eq("user_id", userId)
    .maybeSingle();

  if (row2?.user_id) {
    const next2 = (typeof row2.bonus_ai_scans === "number" ? row2.bonus_ai_scans : 0) + add;
    return applyBonusAiScans(admin, userId, next2);
  }

  return { ok: false, reason: insErr.message };
}

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
    console.error("Stripe webhook signature verification failed");
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id ?? session.client_reference_id ?? null;

    if (!userId) {
      console.error("Stripe checkout.session.completed: missing Supabase user id (metadata/client_reference)");
      return NextResponse.json({ received: true });
    }

    const claim = await tryClaimStripeEvent(supabaseAdmin, event, session.id);
    if (claim.claimError) {
      console.error("Stripe webhook idempotency insert failed:", claim.claimError);
      return NextResponse.json({ error: "Idempotency record failed" }, { status: 500 });
    }
    if (!claim.claimed) {
      return NextResponse.json({ received: true });
    }

    try {
      const checkoutType = session.metadata?.checkout_type;

      if (checkoutType === "scan_pack") {
        const add = stripePackCredits();
        const grant = await grantScanPackCredits(supabaseAdmin, userId, add);
        if (!grant.ok) {
          console.error("Scan pack grant failed:", grant.reason, { userId });
          await releaseStripeEventClaim(supabaseAdmin, event.id);
          return NextResponse.json({ error: "Failed to grant scan pack credits" }, { status: 500 });
        }
      } else {
        const { data: updated, error } = await supabaseAdmin
          .from("profiles")
          .update({ plan: "pro" })
          .eq("user_id", userId)
          .select("user_id");

        if (error) {
          console.error("Failed to update profile to Pro from checkout webhook:", error.message);
          await releaseStripeEventClaim(supabaseAdmin, event.id);
          return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 });
        }
        if (!updated?.length) {
          console.error("Pro checkout webhook: no profile row for user_id", userId);
          await releaseStripeEventClaim(supabaseAdmin, event.id);
          return NextResponse.json({ error: "Profile missing for Pro upgrade" }, { status: 500 });
        }
      }
    } catch (e) {
      console.error("checkout.session.completed handler error");
      await releaseStripeEventClaim(supabaseAdmin, event.id);
      return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.supabase_user_id?.trim() || null;

    if (!userId) {
      console.error(
        "customer.subscription.deleted: missing supabase_user_id on subscription metadata (checkout must set subscription_data.metadata)"
      );
      return NextResponse.json({ received: true });
    }

    const claim = await tryClaimStripeEvent(supabaseAdmin, event, subscription.id);
    if (claim.claimError) {
      console.error("Stripe webhook idempotency insert failed:", claim.claimError);
      return NextResponse.json({ error: "Idempotency record failed" }, { status: 500 });
    }
    if (!claim.claimed) {
      return NextResponse.json({ received: true });
    }

    try {
      const { data: updated, error } = await supabaseAdmin
        .from("profiles")
        .update({ plan: "free" })
        .eq("user_id", userId)
        .select("user_id");

      if (error) {
        console.error("subscription.deleted: profile update failed:", error.message);
        await releaseStripeEventClaim(supabaseAdmin, event.id);
        return NextResponse.json({ error: "Failed to downgrade profile" }, { status: 500 });
      }
      if (!updated?.length) {
        console.error("subscription.deleted: no profile row for user_id", userId);
      }
    } catch {
      console.error("subscription.deleted handler error");
      await releaseStripeEventClaim(supabaseAdmin, event.id);
      return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
