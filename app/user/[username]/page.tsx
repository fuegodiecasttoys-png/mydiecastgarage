"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { areFriends, fetchProfileByUsername } from "../../lib/friendQueries";
import { t } from "../../ui/dv-tokens";
import {
  dvGhostButton,
  dvImageThumb,
  dvListCard,
  dvPageShell,
  dvInput,
  dvSelect,
  dvDisplayFont,
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

const searchInputStyle = { ...dvInput, flex: 1, width: "auto", padding: "10px 12px", fontSize: 14 };
const searchButtonStyle = {
  ...dvGhostButton,
  width: 44,
  padding: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: 12,
  fontSize: 16,
} as const;
const sortSelectStyle = { ...dvSelect, marginBottom: 10 };
const cardStyle = { ...dvListCard, transition: "all 0.2s ease" as const };
const imageWrapStyle = { ...dvImageThumb };
const scaleBadgeStyle = {
  position: "absolute" as const,
  right: 10,
  bottom: 10,
  fontSize: 12,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255,106,0,0.25)",
  background: "rgba(255,106,0,0.08)",
  color: t.textSecondary,
} as const;

export default function UserCollectionPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: rawUsername } = use(params);
  const username = decodeURIComponent(rawUsername).trim().toLowerCase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [ownerUsername, setOwnerUsername] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

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
          setNotFound(true);
          setAllowed(false);
          setOwnerUsername("");
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

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", profile.id)
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
  }, [username, router]);

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

  if (loading) {
    return <FullPageLoading label="Loading collection..." />;
  }

  if (notFound) {
    return (
      <div style={{ ...dvPageShell, padding: 24, textAlign: "center" }}>
        <p style={{ color: t.textSecondary }}>User not found.</p>
        <Link href="/friends" style={{ ...dvGhostButton, display: "inline-block", marginTop: 16 }}>
          Back to Friends
        </Link>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ ...dvPageShell, padding: 24, textAlign: "center" }}>
        <p style={{ color: t.textSecondary, maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>
          {`You can only view this collection if you are friends (accepted) with @${
            ownerUsername || username
          }.`}
        </p>
        <Link href="/friends" style={{ ...dvGhostButton, display: "inline-block", marginTop: 16 }}>
          Friends
        </Link>
      </div>
    );
  }

  const encUser = encodeURIComponent(ownerUsername || username);
  const displayUser = ownerUsername || username;

  return (
    <div style={{ ...dvPageShell, position: "relative", padding: 20 }}>
      <Link href="/friends" style={{ ...dvGhostButton, textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
        ← Friends
      </Link>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1
          style={{
            margin: "0 0 4px",
            fontFamily: dvDisplayFont,
            fontSize: 26,
            fontWeight: 700,
            color: t.textPrimary,
          }}
        >
          @{displayUser}
        </h1>
        <p style={{ margin: "0 0 18px", color: t.textMuted, fontSize: 13 }}>Read-only collection</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
          <button type="button" style={searchButtonStyle} aria-label="Search">
            🔎
          </button>
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)} style={sortSelectStyle}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>

        {paginatedItems.length === 0 ? (
          <p style={{ color: t.textMuted, textAlign: "center", marginTop: 24 }}>No models in this garage.</p>
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
                        background: "rgba(255,106,0,0.14)",
                        color: t.textPrimary,
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        border: "1px solid rgba(255,106,0,0.28)",
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
      </div>
    </div>
  );
}
