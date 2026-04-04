"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type WishlistItem = {
  id: number;
  model: string | null;
  brand: string | null;
  color: string | null;
  scale: string | null;
  main_number: string | null;
  sub_number: string | null;
  series: string | null;
  year: string | null;
  notes: string | null;
  priority: "high" | "medium" | "low" | null;
  photo_url?: string | null;
  created_at?: string | null;
};

export default function WishlistPage() {
  const router = useRouter();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else if (data) {
        setItems(data as WishlistItem[]);
      }

      setLoading(false);
    };

    fetchWishlist();
  }, []);

  const filteredItems = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) return items;

    return items.filter((item) => {
      return (
        item.model?.toLowerCase().includes(text) ||
        item.brand?.toLowerCase().includes(text) ||
        item.color?.toLowerCase().includes(text) ||
        item.scale?.toLowerCase().includes(text) ||
        item.series?.toLowerCase().includes(text) ||
        item.main_number?.toLowerCase().includes(text) ||
        item.sub_number?.toLowerCase().includes(text) ||
        item.year?.toLowerCase().includes(text) ||
        item.notes?.toLowerCase().includes(text)
      );
    });
  }, [items, search]);

  const priorityRank: Record<string, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const sortedItems = useMemo(() => {
    const copy = [...filteredItems];

    copy.sort((a, b) => {
      if (sort === "newest") {
        return (b.id ?? 0) - (a.id ?? 0);
      }

      if (sort === "oldest") {
        return (a.id ?? 0) - (b.id ?? 0);
      }

      if (sort === "az") {
        return (a.model ?? "").localeCompare(b.model ?? "");
      }

      if (sort === "za") {
        return (b.model ?? "").localeCompare(a.model ?? "");
      }

      if (sort === "priority") {
        const aRank = priorityRank[a.priority ?? "medium"] ?? 99;
        const bRank = priorityRank[b.priority ?? "medium"] ?? 99;
        return aRank - bRank;
      }

      return 0;
    });

    return copy;
  }, [filteredItems, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedItems, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const priorityBadge = (priority: WishlistItem["priority"]) => {
    if (priority === "high") {
      return {
        label: "🔴 High",
        bg: "rgba(255,0,0,0.16)",
        border: "1px solid rgba(255,0,0,0.35)",
      };
    }

    if (priority === "low") {
      return {
        label: "🟢 Low",
        bg: "rgba(50,205,50,0.16)",
        border: "1px solid rgba(50,205,50,0.35)",
      };
    }

    return {
      label: "🟡 Medium",
      bg: "rgba(255,215,0,0.16)",
      border: "1px solid rgba(255,215,0,0.35)",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        padding: 20,
        color: "#fff",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <button
        onClick={() => router.push("/")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: 20,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        🏠
      </button>

      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <img
            src="/logo.png"
            alt="My Diecast Garage"
            style={{
              width: 170,
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />

          <h1
            style={{
              fontSize: 28,
              margin: "10px 0 4px 0",
              fontWeight: 800,
            }}
          >
            ⭐ My Wishlist
          </h1>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                background: "#111",
                color: "white",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              style={{
                width: 44,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              🔎
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid #333",
              background: "#111",
              color: "white",
              fontSize: 14,
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="priority">Priority</option>
          </select>

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <button
              onClick={() => router.push("/wishlist/add")}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              + Add
            </button>
          </div>

          <div
            style={{
              opacity: 0.72,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {filteredItems.length} wishlist items
          </div>
        </div>

        {loading && (
          <p
            style={{
              opacity: 0.7,
              fontSize: 16,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Loading...
          </p>
        )}

        {!loading && filteredItems.length === 0 && items.length > 0 && (
          <div
            style={{
              marginTop: 30,
              opacity: 0.6,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            No results found.
          </div>
        )}

        {!loading && items.length === 0 && (
          <div
            style={{
              marginTop: 30,
              opacity: 0.6,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Your wishlist is empty.
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <>
            <div style={{ display: "grid", gap: 16 }}>
              {paginatedItems.map((item) => {
                const badge = priorityBadge(item.priority);

                return (
                  <a
                    key={item.id}
                    href={`/wishlist/${item.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        padding: 10,
                        borderRadius: 16,
                        background:
                          "linear-gradient(180deg, #171717 0%, #101010 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 14,
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#222",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {item.photo_url ? (
                          <img
                            src={item.photo_url}
                            alt={item.model ?? "Wishlist item"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              fontSize: 12,
                              opacity: 0.5,
                            }}
                          >
                            No photo
                          </div>
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
                          {item.brand ?? "No brand"}
                        </div>

                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            lineHeight: 1.1,
                            marginBottom: 4,
                            wordBreak: "break-word",
                            paddingRight: 82,
                          }}
                        >
                          {item.model ?? "Unnamed model"}
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            opacity: 0.85,
                            fontWeight: 500,
                          }}
                        >
                          {item.color ?? "-"}
                          {item.series ? ` • ${item.series}` : ""}
                          {item.year ? ` • ${item.year}` : ""}
                        </div>
                      </div>

                      <span
                        style={{
                          position: "absolute",
                          right: 10,
                          bottom: 10,
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 10,
                          background: badge.bg,
                          border: badge.border,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #333",
                    background: "#111",
                    color: "white",
                    opacity: page === 1 ? 0.4 : 1,
                    cursor: "pointer",
                  }}
                >
                  ⬅️
                </button>

                <span style={{ alignSelf: "center", fontSize: 14 }}>
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #333",
                    background: "#111",
                    color: "white",
                    opacity: page === totalPages ? 0.4 : 1,
                    cursor: "pointer",
                  }}
                >
                  ➡️
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
