"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, use, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { areFriends, fetchProfileByUsername } from "../../lib/friendQueries";
import { isValidUsernameFormat, normalizeUsernameInput } from "../../lib/profileUsername";
import { t } from "../../ui/dv-tokens";
import {
  dvAppPageShell,
  dvDashboardInner,
  dvCardOrangeBorder,
  dvGhostButton,
  dvImageThumb,
  dvListCard,
  dvModelCardAmbientGlow,
  dvModelListCardHoverHandlers,
  dvOrangeGlowSubtle,
  dvInput,
  dvSelect,
} from "../../ui/dv-visual";
import { FullPageLoading } from "../../components/FullPageLoading";

type Item = {
  id: number;
  name: string | null;
  brand: string | null;
  color: string | null;
  scale: string | null;
  photo_url: string | null;
  type: string | null;
  main_number: string | null;
  sub_number: string | null;
  series: string | null;
  year: string | null;
  location: string | null;
  qty: number | null;
  sth: boolean | null;
  th: boolean | null;
  chase: boolean | null;
};

const itemsPerPage = 20;

const backLinkStyle: CSSProperties = {
  ...dvGhostButton,
  padding: "6px 12px",
  borderRadius: t.radiusMd,
  fontSize: 14,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifySelf: "start",
  border: `1px solid ${t.borderMedium}`,
};

const topBarStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: 44,
  marginBottom: 10,
  width: "100%",
};

const logoWrapStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  pointerEvents: "none",
};

const logoImgStyle: CSSProperties = {
  width: 120,
  height: "auto",
  display: "block",
  pointerEvents: "auto",
};

const searchButtonAccentStyle: CSSProperties = {
  ...dvGhostButton,
  width: 44,
  padding: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: t.radiusMd,
  fontSize: 16,
  flexShrink: 0,
  border: `1.5px solid ${dvCardOrangeBorder}`,
  color: t.orange300,
  background: t.surface,
  boxShadow: dvModelCardAmbientGlow,
};

const cardStyle = { ...dvListCard, ...dvModelListCardHoverHandlers, transition: "all 0.2s ease" as const };
const imageWrapStyle = { ...dvImageThumb };

const scaleBadgeStyle: CSSProperties = {
  position: "absolute",
  right: 10,
  bottom: 10,
  fontSize: 12,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 10,
  border: `1.5px solid ${dvCardOrangeBorder}`,
  background: dvOrangeGlowSubtle,
  color: t.textSecondary,
};

function inputFocusStyle(focused: boolean): CSSProperties {
  return {
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    border: `1px solid ${focused ? dvCardOrangeBorder : t.borderSubtle}`,
    boxShadow: focused ? `0 0 0 2px ${t.orangeGlow}` : "none",
  };
}

function ProfilePageChrome({ children }: { children: ReactNode }) {
  return (
    <div style={dvAppPageShell}>
      <div style={dvDashboardInner}>
        <div style={topBarStyle}>
          <Link href="/friends" style={backLinkStyle}>
            ← Friends
          </Link>
          <div style={logoWrapStyle}>
            <img src="/logo.png" alt="My Diecast Garage" style={logoImgStyle} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function UserCollectionPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: rawUsername } = use(params);
  const pathSlug = normalizeUsernameInput(decodeURIComponent(rawUsername));
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [badSlug, setBadSlug] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [ownerUsername, setOwnerUsername] = useState("");
  const [ownerDisplayName, setOwnerDisplayName] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortFocused, setSortFocused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isValidUsernameFormat(pathSlug)) {
        if (!cancelled) {
          setBadSlug(true);
          setNotFound(false);
          setAllowed(false);
          setOwnerUsername("");
          setOwnerDisplayName(null);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setBadSlug(false);
        setNotFound(false);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const profile = await fetchProfileByUsername(supabase, pathSlug);
      if (!profile) {
        if (!cancelled) {
          setBadSlug(false);
          setNotFound(true);
          setAllowed(false);
          setOwnerUsername("");
          setOwnerDisplayName(null);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setOwnerUsername(profile.username);
      }

      const { data: nameRow } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", profile.user_id)
        .maybeSingle();
      if (!cancelled) {
        setOwnerDisplayName((nameRow as { name?: string | null } | null)?.name?.trim() || null);
      }

      const ok = await areFriends(supabase, user.id, profile.user_id);
      if (!cancelled) {
        setAllowed(ok);
        if (!ok) {
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (error) {
          console.error(error);
          setItems([]);
        } else {
          setItems((data as Item[]) ?? []);
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathSlug, router]);

  const filteredItems = useMemo(() => {
    const text = search.toLowerCase().trim();
    if (!text) return items;
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(text) ||
        item.brand?.toLowerCase().includes(text) ||
        item.color?.toLowerCase().includes(text)
    );
  }, [items, search]);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    sorted.sort((a, b) => {
      if (sort === "newest") return (b.id ?? 0) - (a.id ?? 0);
      if (sort === "oldest") return (a.id ?? 0) - (b.id ?? 0);
      if (sort === "az") return (a.name ?? "").localeCompare(b.name ?? "");
      if (sort === "za") return (b.name ?? "").localeCompare(a.name ?? "");
      return 0;
    });
    return sorted;
  }, [filteredItems, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedItems.slice(start, start + itemsPerPage);
  }, [sortedItems, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const searchInputStyle: CSSProperties = {
    ...dvInput,
    ...inputFocusStyle(searchFocused),
    flex: 1,
    width: "auto",
    padding: "10px 12px",
    fontSize: 14,
  };

  const sortSelectStyle: CSSProperties = {
    ...dvSelect,
    ...inputFocusStyle(sortFocused),
    marginBottom: 10,
  };

  if (loading) {
    return <FullPageLoading label="Loading collection..." />;
  }

  if (badSlug) {
    return (
      <ProfilePageChrome>
        <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
          <p style={{ color: t.textSecondary, margin: "0 0 16px" }}>Username unavailable</p>
          <Link href="/friends" style={{ ...dvGhostButton, display: "inline-block", borderRadius: t.radiusMd }}>
            Back to Friends
          </Link>
        </div>
      </ProfilePageChrome>
    );
  }

  if (notFound) {
    return (
      <ProfilePageChrome>
        <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
          <p style={{ color: t.textSecondary, margin: "0 0 16px" }}>No user with that username.</p>
          <Link href="/friends" style={{ ...dvGhostButton, display: "inline-block", borderRadius: t.radiusMd }}>
            Back to Friends
          </Link>
        </div>
      </ProfilePageChrome>
    );
  }

  if (!allowed) {
    return (
      <ProfilePageChrome>
        <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
          <p style={{ color: t.textSecondary, maxWidth: 360, margin: "0 auto 16px", lineHeight: 1.5 }}>
            {`You can only view this collection if you are friends (accepted) with @${
              ownerUsername || pathSlug
            }.`}
          </p>
          <Link href="/friends" style={{ ...dvGhostButton, display: "inline-block", borderRadius: t.radiusMd }}>
            Friends
          </Link>
        </div>
      </ProfilePageChrome>
    );
  }

  const encUser = encodeURIComponent(ownerUsername || pathSlug);
  const displayUser = ownerUsername || pathSlug;

  return (
    <ProfilePageChrome>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        {ownerDisplayName ? (
          <p style={{ margin: "4px 0 4px", color: t.textMuted, fontSize: 14 }}>{ownerDisplayName}</p>
        ) : null}
        <p
          style={{
            margin: ownerDisplayName ? "0 0 0" : "4px 0 0",
            color: t.textMuted,
            fontSize: 13,
          }}
        >
          View only collection
        </p>
        <p
          style={{
            marginTop: 6,
            marginBottom: 10,
            fontSize: 12,
            fontWeight: 400,
            color: t.orange300,
            opacity: 0.78,
            letterSpacing: "0.02em",
          }}
        >
          @{displayUser}
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 0,
            marginBottom: 10,
            alignItems: "stretch",
          }}
        >
          <input
            type="text"
            placeholder="Search this garage…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={searchInputStyle}
          />
          <button type="button" style={searchButtonAccentStyle} aria-label="Search">
            🔎
          </button>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          onFocus={() => setSortFocused(true)}
          onBlur={() => setSortFocused(false)}
          style={sortSelectStyle}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {paginatedItems.length === 0 ? (
        <div
          style={{
            minHeight: "min(52vh, 360px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "32px 16px 24px",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: t.textSecondary,
              margin: "0 0 10px",
              lineHeight: 1.4,
            }}
          >
            No models in this garage.
          </p>
          <p
            style={{
              fontSize: 14,
              color: t.textMuted,
              margin: 0,
              maxWidth: 280,
              lineHeight: 1.45,
            }}
          >
            This collector hasn&apos;t added any models yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {paginatedItems.map((item) => (
            <Link
              key={item.id}
              href={`/user/${encUser}/car/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ marginBottom: 6 }}>
                {item.type === "packed" ? (
                  <span
                    style={{
                      background: dvOrangeGlowSubtle,
                      color: t.textPrimary,
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 12,
                      border: `1.5px solid ${dvCardOrangeBorder}`,
                    }}
                  >
                    📦 Packed
                  </span>
                ) : (
                  <span
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: t.textSecondary,
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 12,
                      border: `1px solid ${t.borderSubtle}`,
                    }}
                  >
                    Loose
                  </span>
                )}
              </div>
              <div style={cardStyle}>
                <div style={imageWrapStyle}>
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.name ?? "Diecast"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ fontSize: 12, opacity: 0.5 }}>No photo</div>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.7,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      marginBottom: 4,
                    }}
                  >
                    {item.brand ?? "Unknown"} • {item.type ?? "—"}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      lineHeight: 1.15,
                      marginBottom: 6,
                      wordBreak: "break-word",
                      paddingRight: 72,
                      color: t.textPrimary,
                    }}
                  >
                    {item.name ?? "Unnamed model"}
                  </div>
                  <div style={{ fontSize: 13, color: t.textSecondary, fontWeight: 500 }}>
                    {item.color ?? "-"}
                  </div>
                </div>
                <span style={scaleBadgeStyle}>{item.scale ?? "-"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              ...dvGhostButton,
              padding: "6px 12px",
              borderRadius: 10,
              opacity: page === 1 ? 0.4 : 1,
            }}
          >
            ⬅️
          </button>
          <span style={{ alignSelf: "center", fontSize: 14, color: t.textSecondary }}>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              ...dvGhostButton,
              padding: "6px 12px",
              borderRadius: 10,
              opacity: page === totalPages ? 0.4 : 1,
            }}
          >
            ➡️
          </button>
        </div>
      )}
    </ProfilePageChrome>
  );
}
