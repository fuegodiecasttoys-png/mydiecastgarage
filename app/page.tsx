"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { FullPageLoading } from "./components/FullPageLoading";

const RADIUS = 18;
const TRANSITION =
  "transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.22s ease";

function garageCountLabel(count: number) {
  if (count === 0) return "No models yet";
  if (count === 1) return "1 model";
  return `${count} models`;
}

function cardSurfaceFixed(accent: "neutral" | "cyan" | "purple" | "orange"): CSSProperties {
  const borderColor =
    accent === "cyan"
      ? "rgba(56,189,248,0.42)"
      : accent === "purple"
        ? "rgba(192,132,252,0.32)"
        : accent === "orange"
          ? "rgba(251,146,60,0.32)"
          : "rgba(255,255,255,0.1)";

  const fill =
    accent === "cyan"
      ? "linear-gradient(165deg, rgba(32,44,62,0.98) 0%, rgba(18,24,40,0.99) 42%, rgba(10,14,26,1) 100%)"
      : accent === "purple"
        ? "linear-gradient(165deg, rgba(40,32,54,0.97) 0%, rgba(22,18,34,1) 100%)"
        : accent === "orange"
          ? "linear-gradient(165deg, rgba(48,34,26,0.97) 0%, rgba(26,18,14,1) 100%)"
          : "linear-gradient(165deg, rgba(40,42,50,0.97) 0%, rgba(22,23,30,1) 100%)";

  const outerGlow =
    accent === "cyan"
      ? "0 16px 48px rgba(0,0,0,0.52), 0 0 64px rgba(14,165,233,0.26), 0 0 0 1px rgba(56,189,248,0.14)"
      : accent === "purple"
        ? "0 14px 40px rgba(0,0,0,0.5), 0 0 48px rgba(168,85,247,0.14)"
        : accent === "orange"
          ? "0 14px 40px rgba(0,0,0,0.5), 0 0 48px rgba(249,115,22,0.12)"
          : "0 14px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)";

  return {
    background: fill,
    border: `1px solid ${borderColor}`,
    boxShadow: `${outerGlow}, inset 0 1px 0 rgba(255,255,255,0.11), inset 0 -18px 36px rgba(0,0,0,0.32)`,
  };
}

function IconCircle({
  children,
  bg,
  border,
  innerGlow,
  size = 48,
}: {
  children: ReactNode;
  bg: string;
  border: string;
  innerGlow?: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        border: `1px solid ${border}`,
        display: "grid",
        placeItems: "center",
        fontSize: Math.round(size * 0.46),
        flexShrink: 0,
        boxShadow: innerGlow
          ? `${innerGlow}, 0 6px 18px rgba(0,0,0,0.45)`
          : "0 6px 18px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      {children}
    </div>
  );
}

const subtitle: CSSProperties = {
  fontSize: 12,
  fontWeight: 550,
  color: "rgba(255,255,255,0.64)",
  lineHeight: 1.4,
  letterSpacing: "0.01em",
};

function PressableSurface({
  children,
  onClick,
  style,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  style: CSSProperties;
  disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);

  const scale =
    disabled ? 1 : pressed ? 0.972 : hover ? 1.028 : 1;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onPointerEnter={() => !disabled && setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={{
        ...style,
        transform: `scale(${scale})`,
        transition: TRANSITION,
        willChange: "transform",
        WebkitTapHighlightColor: "transparent",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

const chevron = (color: string): CSSProperties => ({
  fontSize: 22,
  fontWeight: 200,
  lineHeight: 1,
  color,
  opacity: 0.92,
  marginLeft: 6,
  flexShrink: 0,
  textShadow: `0 0 20px ${color}55`,
});

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [garageCount, setGarageCount] = useState(0);
  const [logoutPress, setLogoutPress] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

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

  const logoutScale = logoutPress ? 0.94 : logoutHover ? 1.04 : 1;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: `
          radial-gradient(ellipse 130% 90% at 50% -18%, rgba(56,189,248,0.28) 0%, rgba(14,165,233,0.1) 32%, transparent 58%),
          radial-gradient(ellipse 90% 70% at 100% 0%, rgba(99,102,241,0.12) 0%, transparent 42%),
          radial-gradient(ellipse 70% 60% at 0% 40%, rgba(14,165,233,0.08) 0%, transparent 48%),
          radial-gradient(ellipse 100% 80% at 50% 120%, rgba(15,23,42,0.9) 0%, transparent 55%),
          linear-gradient(180deg, #090b12 0%, #06070e 38%, #03040a 100%)
        `,
        padding: "24px 20px 40px",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 392,
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={handleLogout}
          onPointerEnter={() => setLogoutHover(true)}
          onPointerLeave={() => {
            setLogoutHover(false);
            setLogoutPress(false);
          }}
          onPointerDown={() => setLogoutPress(true)}
          onPointerUp={() => setLogoutPress(false)}
          style={{
            position: "absolute",
            top: 2,
            right: 0,
            zIndex: 2,
            transform: `scale(${logoutScale})`,
            transition: TRANSITION,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "rgba(255,255,255,0.92)",
            padding: "8px 16px",
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            boxShadow:
              "0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Logout
        </button>

        {/* Branding */}
        <div style={{ textAlign: "center", paddingTop: 8, marginBottom: 32 }}>
          <div
            style={{
              marginBottom: 18,
              filter:
                "drop-shadow(0 0 28px rgba(56,189,248,0.45)) drop-shadow(0 12px 32px rgba(0,0,0,0.55))",
            }}
          >
            <img
              src="/logo.png"
              alt="My Diecast Garage"
              style={{
                width: 92,
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 12.5,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              lineHeight: 1.55,
              color: "#bae6fd",
              textShadow:
                "0 0 36px rgba(56,189,248,0.55), 0 0 1px rgba(125,211,252,0.9), 0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            <span aria-hidden style={{ opacity: 0.35, letterSpacing: "0.14em" }}>
              —
            </span>{" "}
            MY DIECAST GARAGE{" "}
            <span aria-hidden style={{ opacity: 0.35, letterSpacing: "0.14em" }}>
              —
            </span>
          </h1>
        </div>

        {/* Add Packed / Add Loose */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <PressableSurface
            onClick={() => router.push("/capture-packed")}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              padding: "18px 12px 16px",
              gap: 12,
              minHeight: 128,
              borderRadius: RADIUS,
              textAlign: "left",
              color: "#fff",
              border: "none",
              ...cardSurfaceFixed("neutral"),
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconCircle
                bg="linear-gradient(145deg, rgba(96,165,250,0.35) 0%, rgba(37,99,235,0.25) 100%)"
                border="rgba(147,197,253,0.55)"
                innerGlow="inset 0 1px 0 rgba(255,255,255,0.25)"
              >
                📦
              </IconCircle>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 6,
                  letterSpacing: "-0.03em",
                }}
              >
                Add Packed
              </div>
              <div style={subtitle}>Boxed models</div>
            </div>
          </PressableSurface>

          <PressableSurface
            onClick={() => router.push("/capture-loose")}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              padding: "18px 12px 16px",
              gap: 12,
              minHeight: 128,
              borderRadius: RADIUS,
              textAlign: "left",
              color: "#fff",
              border: "none",
              ...cardSurfaceFixed("neutral"),
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconCircle
                bg="linear-gradient(145deg, rgba(96,165,250,0.35) 0%, rgba(37,99,235,0.25) 100%)"
                border="rgba(147,197,253,0.55)"
                innerGlow="inset 0 1px 0 rgba(255,255,255,0.25)"
              >
                🚗
              </IconCircle>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 6,
                  letterSpacing: "-0.03em",
                }}
              >
                Add Loose
              </div>
              <div style={subtitle}>Loose models</div>
            </div>
          </PressableSurface>
        </div>

        {/* My Garage — hero */}
        <PressableSurface
          onClick={() => router.push("/mygarage")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 18px",
            marginBottom: 20,
            minHeight: 132,
            borderRadius: RADIUS,
            textAlign: "left",
            color: "#fff",
            border: "none",
            ...cardSurfaceFixed("cyan"),
            boxShadow:
              "0 18px 52px rgba(0,0,0,0.55), 0 0 72px rgba(14,165,233,0.32), 0 0 0 1px rgba(56,189,248,0.18), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -18px 36px rgba(0,0,0,0.32)",
          }}
        >
          <IconCircle
            size={52}
            bg="linear-gradient(145deg, rgba(56,189,248,0.45) 0%, rgba(2,132,199,0.35) 100%)"
            border="rgba(186,230,253,0.65)"
            innerGlow="inset 0 1px 0 rgba(255,255,255,0.35)"
          >
            🏠
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                marginBottom: 10,
                textShadow: "0 1px 0 rgba(0,0,0,0.35)",
              }}
            >
              My Garage
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: "#ecfeff",
                background:
                  "linear-gradient(180deg, rgba(34,211,238,0.38) 0%, rgba(8,145,178,0.48) 100%)",
                border: "1px solid rgba(103,232,249,0.55)",
                marginBottom: 10,
                boxShadow:
                  "0 0 28px rgba(34,211,238,0.4), 0 4px 14px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.28)",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {garageCount > 0 ? (
                <span
                  style={{ fontSize: 12, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.45))" }}
                  aria-hidden
                >
                  📦
                </span>
              ) : null}
              {garageCountLabel(garageCount)}
            </div>
            <div style={{ ...subtitle, fontSize: 13, color: "rgba(255,255,255,0.62)" }}>
              View your collection
            </div>
          </div>
          <span style={chevron("#67e8f9")} aria-hidden>
            ›
          </span>
        </PressableSurface>

        {/* Wishlist */}
        <PressableSurface
          onClick={() => router.push("/wishlist")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 18px",
            marginBottom: 20,
            borderRadius: RADIUS,
            textAlign: "left",
            color: "#fff",
            border: "none",
            ...cardSurfaceFixed("purple"),
          }}
        >
          <IconCircle
            bg="linear-gradient(145deg, rgba(192,132,252,0.4) 0%, rgba(126,34,206,0.3) 100%)"
            border="rgba(216,180,254,0.5)"
            innerGlow="inset 0 1px 0 rgba(255,255,255,0.2)"
          >
            💜
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                marginBottom: 6,
                letterSpacing: "-0.03em",
              }}
            >
              Wishlist
            </div>
            <div style={subtitle}>Models you want next</div>
          </div>
          <span style={chevron("#d8b4fe")} aria-hidden>
            ›
          </span>
        </PressableSurface>

        {/* Add Friends */}
        <div
          role="group"
          aria-label="Add friends, coming soon"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 18px",
            marginBottom: 20,
            borderRadius: RADIUS,
            textAlign: "left",
            color: "#fff",
            opacity: 0.5,
            filter: "saturate(0.72)",
            cursor: "default",
            pointerEvents: "none",
            ...cardSurfaceFixed("neutral"),
          }}
        >
          <IconCircle
            bg="linear-gradient(145deg, rgba(74,222,128,0.22) 0%, rgba(22,101,52,0.2) 100%)"
            border="rgba(134,239,172,0.35)"
          >
            👥
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                marginBottom: 6,
                letterSpacing: "-0.03em",
              }}
            >
              Add Friends
            </div>
            <div style={{ ...subtitle, color: "rgba(255,255,255,0.5)" }}>
              Connect with collectors
            </div>
          </div>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "7px 11px",
              borderRadius: 999,
              border: "1px solid rgba(134,239,172,0.35)",
              color: "rgba(220,252,231,0.88)",
              background: "rgba(20,83,45,0.45)",
              flexShrink: 0,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            Coming soon
          </span>
        </div>

        {/* How To */}
        <PressableSurface
          onClick={() => router.push("/howto")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 18px",
            marginBottom: 0,
            borderRadius: RADIUS,
            textAlign: "left",
            color: "#fff",
            border: "none",
            ...cardSurfaceFixed("orange"),
          }}
        >
          <IconCircle
            bg="linear-gradient(145deg, rgba(251,146,60,0.42) 0%, rgba(194,65,12,0.32) 100%)"
            border="rgba(253,186,116,0.55)"
            innerGlow="inset 0 1px 0 rgba(255,255,255,0.22)"
          >
            📖
          </IconCircle>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                marginBottom: 6,
                letterSpacing: "-0.03em",
              }}
            >
              How To
            </div>
            <div style={subtitle}>Tips for great photos</div>
          </div>
          <span style={chevron("#fdba74")} aria-hidden>
            ›
          </span>
        </PressableSurface>
      </div>
    </div>
  );
}
