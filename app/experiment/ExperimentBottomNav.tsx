"use client";

import { usePathname } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { supabase } from "../lib/supabaseClient";
import { ExpIconHouse, ExpIconPlus, ExpIconUsers, ExpIconUser, ExpIconWarehouse } from "./experimentIcons";
import { experimentOrange, experimentOrangeGlow, experimentTextMuted, experimentTextStrong } from "./experimentHeroStyle";

const dim = "rgba(200, 210, 220, 0.36)";

type Prop = { router: AppRouterInstance; userId: string | null };

export function ExperimentBottomNav({ router, userId }: Prop) {
  const pathname = usePathname() ?? "";

  const onProfile = async () => {
    if (!userId) {
      void router.push("/");
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();
    const u = (data as { username: string | null } | null)?.username;
    if (u) void router.push(`/${u}`);
    else void router.push("/");
  };

  return (
    <nav
      aria-label="Main"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        maxWidth: 400,
        margin: "0 auto",
        boxSizing: "border-box",
        padding: "4px 8px 10px",
        paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 72px 1fr 1fr",
        alignItems: "end",
        justifyItems: "center",
        background: "linear-gradient(180deg, rgba(4,6,10,0.15) 0%, rgba(6,8,12,0.97) 40%, #04060a 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 -6px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <NavIcon
        label="Home"
        active={pathname === "/"}
        onClick={() => void router.push("/")}
      >
        <ExpIconHouse color={pathname === "/" ? experimentOrange : dim} size={22} />
      </NavIcon>
      <NavIcon
        label="Garage"
        active={pathname === "/mygarage"}
        onClick={() => void router.push("/mygarage")}
      >
        <ExpIconWarehouse color={pathname === "/mygarage" ? experimentOrange : dim} size={22} />
      </NavIcon>
      <div style={{ position: "relative", width: 72, height: 1, placeSelf: "end center" }}>
        <button
          type="button"
          aria-label="Add"
          onClick={() => void router.push("/capture-packed")}
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "none",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            background: "linear-gradient(165deg, #ffb84a 0%, " + experimentOrange + " 45%, #d96a00 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,220,180,0.25)," +
              "0 4px 22px " +
              experimentOrangeGlow +
              "," +
              "0 10px 36px rgba(0,0,0,0.55)",
            color: "#fff",
          }}
        >
          <ExpIconPlus color="rgba(255,255,255,0.98)" size={26} />
        </button>
      </div>
      <NavIcon
        label="Friends"
        active={pathname === "/friends"}
        onClick={() => void router.push("/friends")}
      >
        <ExpIconUsers color={pathname === "/friends" ? experimentOrange : dim} size={22} />
      </NavIcon>
      <NavIcon label="Profile" active={false} onClick={onProfile}>
        <ExpIconUser color={dim} size={22} />
      </NavIcon>
    </nav>
  );
}

function NavIcon({
  label,
  children,
  active,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 0 4px",
        minHeight: 48,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? experimentTextStrong : experimentTextMuted,
        boxSizing: "border-box",
      }}
    >
      {children}
    </button>
  );
}
