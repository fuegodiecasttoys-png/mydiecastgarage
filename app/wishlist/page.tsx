"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type WishlistItem = {
  id: number;
  name: string | null;
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
        item.name?.toLowerCase().includes(text) ||
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
        return (a.name ?? "").localeCompare(b.name ?? "");
      }

      if (sort === "za") {
        return (b.name ?? "").localeCompare(a.name ?? "");
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
          position: "fixed",
          top: 20,
          left: 20,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: 20,
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        🏠
      </button>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 30,
            marginBottom: 20,
            gap: 12,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700 }}>⭐ My Wishlist</div>

          <button
            onClick={() => router.push("/wishlist/add")}
            style={{
              background: "rgba(30,144,255,0.15)",
              border: "1px solid rgba(30,144,255,0.4)",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Add
          </button>
        </div>

        <input
          type="text"
          placeholder="Search your wishlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: 10,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#111",
            color: "#fff",
            fontSize: 15,
            boxSizing: "border-box",
          }}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: 14,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#111",
            color: "#fff",
            fontSize: 15,
            boxSizing: "border-box",
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="priority">Priority</option>
        </select>

        <div style={{ opacity: 0.7, marginBottom: 14 }}>
          {loading ? "Loading..." : `${sortedItems.length} wishlist items`}
        </div>

        {loading ? (
          <div style={{ opacity: 0.6 }}>Loading...</div>
        ) : sortedItems.length === 0 ? (
          <div style={{ opacity: 0.6 }}>No items yet...</div>
        ) : (
          <>
            <div style={{ display: "grid", gap: 12 }}>
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
                        background: "#111",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 18,
                        padding: 14,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 86,
                            height: 86,
                            borderRadius: 14,
                            overflow: "hidden",
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.06)",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.photo_url ? (
                            <img
                              src={item.photo_url}
                              alt={item.name || "Wishlist item"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div style={{ opacity: 0.35, fontSize: 12 }}>
                              No Photo
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 17,
                              fontWeight: 800,
                              marginBottom: 4,
                            }}
                          >
                            {item.name || "Unnamed"}
                          </div>

                          <div
                            style={{
                              opacity: 0.75,
                              fontSize: 14,
                              marginBottom: 6,
                            }}
                          >
                            {item.brand || "-"}
                            {item.color ? ` • ${item.color}` : ""}
                            {item.scale ? ` • ${item.scale}` : ""}
                          </div>

                          <div
                            style={{
                              opacity: 0.55,
                              fontSize: 13,
                              marginBottom: 8,
                            }}
                          >
                            {item.series || "-"}
                            {item.main_number ? ` • ${item.main_number}` : ""}
                            {item.sub_number ? ` • ${item.sub_number}` : ""}
                            {item.year ? ` • ${item.year}` : ""}
                          </div>

                          <div
                            style={{
                              display: "inline-block",
                              padding: "6px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              ...badge,
                            }}
                          >
                            {badge.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: page === 1 ? "#181818" : "#111",
                    color: page === 1 ? "#666" : "#fff",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ← Prev
                </button>

                <div style={{ opacity: 0.75 }}>
                  Page {page} of {totalPages}
                </div>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: page === totalPages ? "#181818" : "#111",
                    color: page === totalPages ? "#666" : "#fff",
                    cursor:
                      page === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

