"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { FullPageLoading } from "./components/FullPageLoading";

function garageCountLabel(count: number) {
  if (count === 0) return "No models yet";
  if (count === 1) return "1 model";
  return `${count} models`;
}

function IconCircle({
  children,
  bg,
  border,
}: {
  children: ReactNode;
  bg: string;
  border: string;
}) {
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        background: bg,
        border: `1px solid ${border}`,
        display: "grid",
        placeItems: "center",
        fontSize: 22,
        flexShrink: 0,
        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
}

const chevronStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 300,
  opacity: 0.85,
  marginLeft: 8,
  flexShrink: 0,
};

const rowCardBase: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "16px 16px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(165deg, rgba(28,28,32,0.98) 0%, rgba(16,16,20,0.99) 100%)",
  boxShadow: "0 8px 28px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)",
  cursor: "pointer",
  textAlign: "left",
  color: "#fff",
  WebkitTapHighlightColor: "transparent",
};

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [garageCount, setGarageCount] = useState(0);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Error logging out");
      return;
    }

    router.replace("/login");
  };

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const { count, error } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", data.user.id);

      if (!error && count !== null) {
        setGarageCount(count);
      } else {
        setGarageCount(0);
      }

      setCheckingAuth(false);
    }

    void checkUser();
  }, [router]);

  if (checkingAuth) {
    return <FullPageLoading label="Loading your garage..." />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(ellipse 120% 70% at 50% -8%, rgba(55,184,255,0.16) 0%, transparent 52%), radial-gradient(ellipse 90% 50% at 50% 100%, rgba(21,131,255,0.06) 0%, transparent 45%), linear-gradient(180deg, #07080c 0%, #05060a 40%, #040508 100%)",
        padding: "20px 18px 32px",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 2,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.88)",
            padding: "7px 14px",
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          Logout
        </button>

        {/* Branding */}
        <div style={{ textAlign: "center", paddingTop: 4, marginBottom: 26 }}>
          <div
            style={{
              marginBottom: 14,
              filter: "drop-shadow(0 0 20px rgba(55,184,255,0.35)) drop-shadow(0 6px 24px rgba(0,0,0,0.45))",
            }}
          >
            <img
              src="/logo.png"
              alt="My Diecast Garage"
              style={{
                width: 88,
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              lineHeight: 1.45,
              color: "#7dd3fc",
              textShadow:
                "0 0 28px rgba(56,189,248,0.4), 0 1px 0 rgba(0,0,0,0.35)",
            }}
          >
            <span aria-hidden style={{ opacity: 0.4, letterSpacing: "0.08em" }}>
              —
            </span>{" "}
            MY DIECAST GARAGE{" "}
            <span aria-hidden style={{ opacity: 0.4, letterSpacing: "0.08em" }}>
              —
            </span>
          </h1>
        </div>

        {/* Add Packed / Add Loose */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/capture-packed")}
            style={{
              ...rowCardBase,
              flexDirection: "column",
              alignItems: "stretch",
              padding: "16px 12px 14px",
              gap: 10,
              minHeight: 118,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconCircle
                bg="rgba(59,130,246,0.22)"
                border="rgba(96,165,250,0.45)"
              >
                📦
              </IconCircle>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                }}
              >
                Add Packed
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.52)",
                  lineHeight: 1.35,
                }}
              >
                Boxed models
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/capture-loose")}
            style={{
              ...rowCardBase,
              flexDirection: "column",
              alignItems: "stretch",
              padding: "16px 12px 14px",
              gap: 10,
              minHeight: 118,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconCircle
                bg="rgba(59,130,246,0.22)"
                border="rgba(96,165,250,0.45)"
              >
                🚗
              </IconCircle>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                }}
              >
                Add Loose
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.52)",
                  lineHeight: 1.35,
                }}
              >
                Loose models
              </div>
            </div>
          </button>
        </div>

        {/* My Garage — primary */}
        <button
          type="button"
          onClick={() => router.push("/mygarage")}
          style={{
            ...rowCardBase,
            marginBottom: 12,
            padding: "18px 16px",
            border: "1px solid rgba(56,189,248,0.35)",
            background:
              "linear-gradient(165deg, rgba(24,32,44,0.98) 0%, rgba(14,18,28,0.99) 100%)",
            boxShadow:
              "0 0 0 1px rgba(14,165,233,0.08), 0 12px 40px rgba(0,0,0,0.45), 0 0 48px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            minHeight: 120,
          }}
        >
          <IconCircle
            bg="rgba(14,165,233,0.28)"
            border="rgba(56,189,248,0.5)"
          >
            🏠
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              My Garage
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 11px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: "rgba(224,242,254,0.95)",
                background: "rgba(14,165,233,0.22)",
                border: "1px solid rgba(56,189,248,0.35)",
                marginBottom: 8,
                boxShadow: "0 2px 10px rgba(14,165,233,0.15)",
              }}
            >
              {garageCount > 0 ? (
                <span style={{ fontSize: 11, opacity: 0.95 }} aria-hidden>
                  📦
                </span>
              ) : null}
              {garageCountLabel(garageCount)}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.35,
              }}
            >
              View your collection
            </div>
          </div>
          <span style={{ ...chevronStyle, color: "#38bdf8" }} aria-hidden>
            ›
          </span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => router.push("/wishlist")}
          style={{ ...rowCardBase, marginBottom: 12 }}
        >
          <IconCircle
            bg="rgba(168,85,247,0.2)"
            border="rgba(192,132,252,0.45)"
          >
            💜
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Wishlist
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.52)",
                lineHeight: 1.35,
              }}
            >
              Models you want next
            </div>
          </div>
          <span style={{ ...chevronStyle, color: "#c084fc" }} aria-hidden>
            ›
          </span>
        </button>

        {/* Add Friends — coming soon */}
        <div
          role="group"
          aria-label="Add friends, coming soon"
          style={{
            ...rowCardBase,
            marginBottom: 12,
            opacity: 0.62,
            cursor: "default",
            pointerEvents: "none",
          }}
        >
          <IconCircle
            bg="rgba(34,197,94,0.16)"
            border="rgba(74,222,128,0.35)"
          >
            👥
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              Add Friends
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.35,
              }}
            >
              Connect with collectors
            </div>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(74,222,128,0.45)",
              color: "rgba(187,247,208,0.95)",
              background: "rgba(22,101,52,0.35)",
              flexShrink: 0,
            }}
          >
            Coming soon
          </span>
        </div>

        {/* How To */}
        <button
          type="button"
          onClick={() => router.push("/howto")}
          style={{ ...rowCardBase, marginBottom: 0 }}
        >
          <IconCircle
            bg="rgba(249,115,22,0.18)"
            border="rgba(251,146,60,0.45)"
          >
            📖
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              How To
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.52)",
                lineHeight: 1.35,
              }}
            >
              Tips for great photos
            </div>
          </div>
          <span style={{ ...chevronStyle, color: "#fb923c" }} aria-hidden>
            ›
          </span>
        </button>
      </div>
    </div>
  );
}
