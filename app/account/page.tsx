"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FullPageLoading } from "../components/FullPageLoading";
import { AccentBadge } from "../ui/AccentBadge";
import { IconCircle } from "../ui/IconCircle";
import { isActiveProRow } from "../lib/fetchProfile";
import { supabase } from "../lib/supabaseClient";
import { t } from "../ui/dv-tokens";
import {
  dvAppPageShell,
  dvDashboardInner,
  dvDisplayFont,
  dvGhostButton,
  dvListCard,
  dvPrimaryButton,
  dvRowCardBase,
} from "../ui/dv-visual";

type ProfileRow = {
  username?: string | null;
  name?: string | null;
  last_name?: string | null;
  plan?: string | null;
  is_active?: boolean | null;
  monthly_ai_scans?: number | null;
  ai_credits?: number | null;
  monthly_captures?: number | null;
  pro_expires_at?: string | null; // 🔥 FIX
};

const LIMIT = 50;

function formatPlanExpires(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const d = new Date(raw.trim());
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    async function run() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? null);

      const { data } = await supabase
        .from("profiles")
        .select(
          "username, name, last_name, plan, is_active, monthly_ai_scans, ai_credits, monthly_captures, pro_expires_at"
        )
        .eq("user_id", user.id)
        .single();

      setProfile((data as ProfileRow) ?? null);
      setLoading(false);
    }

    void run();
  }, [router]);

  if (loading) return <FullPageLoading label="Loading..." />;

  const expiresLabel = formatPlanExpires(profile?.pro_expires_at);
  const activePro = isActiveProRow(profile);

  return (
    <div style={dvAppPageShell}>
      <div style={dvDashboardInner}>
        <h1>My Account</h1>

        <div>
          Plan: {profile?.plan}
        </div>

        {activePro && (
          <p>
            {expiresLabel
              ? `Renews on: ${expiresLabel}`
              : "No expiration date"}
          </p>
        )}
      </div>
    </div>
  );
}