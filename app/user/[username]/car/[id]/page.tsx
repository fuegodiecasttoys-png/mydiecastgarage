"use client";

import Link from "next/link";
import { useEffect, useState, use, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { areFriends, fetchProfileByUsername } from "../../../../lib/friendQueries";
import { t } from "../../../../ui/dv-tokens";
import { dvGhostButton, dvPageShell, dvDisplayFont } from "../../../../ui/dv-visual";
import { FullPageLoading } from "../../../../components/FullPageLoading";

type Item = {
  id: number;
  brand: string | null;
  name: string | null;
  color: string | null;
  scale: string | null;
  year: string | null;
  series: string | null;
  main_number: string | null;
  sub_number: string | null;
  location: string | null;
  notes: string | null;
  photo_url: string | null;
  type: string | null;
  sth: boolean | null;
  th: boolean | null;
  chase: boolean | null;
  qty: number | null;
  favorite: boolean | null;
};

const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
  width: "100%",
};

const labelStyle: CSSProperties = {
  color: t.textMuted,
  minWidth: 88,
  fontSize: 13,
  fontWeight: 600,
};

const valueStyle: CSSProperties = {
  textAlign: "right",
  flex: 1,
  wordBreak: "break-word",
  color: t.textPrimary,
  fontSize: 14,
  fontWeight: 500,
};

const panelStyle: CSSProperties = {
  background: t.surface,
  border: `1px solid ${t.borderSubtle}`,
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
};

export default function UserCarReadOnlyPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username: rawUsername, id: rawId } = use(params);
  const username = decodeURIComponent(rawUsername).trim().toLowerCase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Item | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [notFoundUser, setNotFoundUser] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [ownerUsername, setOwnerUsername] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const profile = await fetchProfileByUsername(supabase, username);
      if (!profile) {
        if (!cancelled) {
          setNotFoundUser(true);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) setOwnerUsername(profile.username);

      const ok = await areFriends(supabase, user.id, profile.id);
      if (!cancelled) {
        setAllowed(ok);
        if (!ok) {
          setLoading(false);
          return;
        }
      }

      const idNum = Number(rawId);
      if (!Number.isFinite(idNum)) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", idNum)
        .eq("user_id", profile.id)
        .maybeSingle();

      if (!cancelled) {
        if (error || !data) {
          setItem(null);
        } else {
          setItem(data as Item);
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username, rawId, router]);

  if (loading) {
    return <FullPageLoading label="Loading diecast..." />;
  }

  if (notFoundUser) {
    return (
      <div style={{ ...dvPageShell, padding: 24, textAlign: "center" }}>
        <p style={{ color: t.textSecondary }}>User not found.</p>
        <Link href="/friends" style={{ ...dvGhostButton, display: "inline-block", marginTop: 16 }}>
          Friends
        </Link>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ ...dvPageShell, padding: 24, textAlign: "center" }}>
        <p style={{ color: t.textSecondary, maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>
          You can only view this car if you are friends with @{username}.
        </p>
        <Link href="/friends" style={{ ...dvGhostButton, display: "inline-block", marginTop: 16 }}>
          Friends
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ ...dvPageShell, padding: 24, textAlign: "center" }}>
        <p style={{ color: t.textSecondary }}>This model is not in their garage.</p>
        <Link
          href={`/user/${encodeURIComponent(ownerUsername || username)}`}
          style={{ ...dvGhostButton, display: "inline-block", marginTop: 16 }}
        >
          ← Collection
        </Link>
      </div>
    );
  }

  const enc = encodeURIComponent(ownerUsername || username);
  const backHref = `/user/${enc}`;

  return (
    <div style={{ ...dvPageShell, padding: 20 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            marginBottom: 20,
            gap: 12,
          }}
        >
          <Link href={backHref} style={{ ...dvGhostButton, textDecoration: "none", justifySelf: "start" }}>
            ← Back
          </Link>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.textMuted,
              border: `1px solid ${t.borderSubtle}`,
              padding: "6px 10px",
              borderRadius: 999,
            }}
          >
            Read-only
          </span>
        </div>

        <p style={{ margin: "0 0 16px", fontSize: 13, color: t.textMuted }}>
          @{ownerUsername || username}&apos;s collection
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 240,
            aspectRatio: "1",
            borderRadius: 18,
            overflow: "hidden",
            background: t.bgSecondary,
            margin: "0 auto 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            border: `1px solid ${t.borderSubtle}`,
          }}
        >
          {item.photo_url ? (
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              style={{
                width: "100%",
                height: "100%",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "zoom-in",
              }}
              aria-label="View full image"
            >
              <img
                src={item.photo_url}
                alt={item.name || "Diecast"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%", color: t.textMuted, fontSize: 13 }}>
              No photo
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <h1
            style={{
              margin: "0 0 6px",
              fontFamily: dvDisplayFont,
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: t.textPrimary,
            }}
          >
            {item.name ?? "Unnamed model"}
          </h1>
          <div style={{ opacity: 0.75, fontSize: 14, fontWeight: 600, color: t.textSecondary }}>
            {item.brand ?? "Unknown brand"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          {item.type === "packed" ? (
            <span
              style={{
                background: "rgba(255,106,0,0.14)",
                color: t.orange300,
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid rgba(255,106,0,0.28)",
              }}
            >
              Packed
            </span>
          ) : item.type ? (
            <span
              style={{
                background: "rgba(255,255,255,0.06)",
                color: t.textSecondary,
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                border: `1px solid ${t.borderSubtle}`,
              }}
            >
              Loose
            </span>
          ) : null}
          {item.favorite ? (
            <span
              style={{
                background: "rgba(255,106,0,0.12)",
                color: t.orange300,
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Favorite
            </span>
          ) : null}
          {item.sth ? (
            <span
              style={{
                background: "#f59e0b",
                color: "#000",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              STH
            </span>
          ) : null}
          {item.th ? (
            <span
              style={{
                background: "#22c55e",
                color: "#000",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              TH
            </span>
          ) : null}
          {item.chase ? (
            <span
              style={{
                background: "#e11d48",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Chase
            </span>
          ) : null}
        </div>

        <div style={panelStyle}>
          <div style={rowStyle}>
            <span style={labelStyle}>Brand</span>
            <span style={valueStyle}>{item.brand ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Model</span>
            <span style={valueStyle}>{item.name ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Color</span>
            <span style={valueStyle}>{item.color ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Scale</span>
            <span style={valueStyle}>{item.scale ?? "-"}</span>
          </div>
          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>Qty</span>
            <span style={valueStyle}>{item.qty ?? 1}</span>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={rowStyle}>
            <span style={labelStyle}>Number</span>
            <span style={valueStyle}>{item.main_number ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Subnumber</span>
            <span style={valueStyle}>{item.sub_number ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Series</span>
            <span style={valueStyle}>{item.series ?? "-"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Year</span>
            <span style={valueStyle}>{item.year ?? "-"}</span>
          </div>
          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>Location</span>
            <span style={valueStyle}>{item.location ?? "-"}</span>
          </div>
        </div>

        {item.notes ? (
          <div style={panelStyle}>
            <div style={{ ...labelStyle, marginBottom: 10 }}>Notes</div>
            <div style={{ lineHeight: 1.55, wordBreak: "break-word", color: t.textSecondary, fontSize: 14 }}>
              {item.notes}
            </div>
          </div>
        ) : null}

        {showImageModal && item.photo_url ? (
          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
              padding: 20,
              border: "none",
              cursor: "zoom-out",
            }}
            aria-label="Close image"
          >
            <img
              src={item.photo_url}
              alt={item.name || "Diecast"}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: 12,
              }}
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
