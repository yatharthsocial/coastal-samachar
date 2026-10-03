"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Bookmark, Search, SearchX, X } from "lucide-react";
import type { PostCardData } from "@/lib/posts";
import { useBookmarks } from "@/lib/store";
import { PostCard } from "./PostCard";
import { EmptyState } from "./PageHeader";

type Sort = "newest" | "oldest" | "quick";
const PAGE = 9;

export function StoryBrowser({
  posts,
  mode = "magazine",
}: {
  posts: PostCardData[];
  mode?: "magazine" | "search" | "saved";
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { list: saved } = useBookmarks();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("newest");
  const [limit, setLimit] = useState(PAGE);

  const pool = mode === "saved" ? posts.filter((p) => saved.includes(p.slug)) : posts;

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of pool) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [pool]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = pool.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!terms.length) return true;
      const hay = `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(" ")}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    return [...filtered].sort((a, b) =>
      sort === "quick"
        ? a.readingTime - b.readingTime
        : sort === "oldest"
          ? +new Date(a.date) - +new Date(b.date)
          : +new Date(b.date) - +new Date(a.date),
    );
  }, [pool, query, category, sort]);

  const updateQuery = (q: string) => {
    setQuery(q);
    setLimit(PAGE);
    if (mode === "search") {
      router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
    }
  };

  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] ?? 0) + 1)));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);
  }, [posts]);

  if (mode === "saved" && pool.length === 0) {
    return (
      <EmptyState icon={<Bookmark className="size-6" />} title="Nothing saved yet">
        Tap <strong className="text-pocket">Save to pocket</strong> or the bookmark icon on any story to keep it here
        for later.{" "}
        <Link href="/magazine" className="font-semibold text-accent hover:underline">
          Browse stories
        </Link>
      </EmptyState>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex h-12 flex-1 items-center gap-3 rounded-full bg-white px-5 ring-accent/30 transition focus-within:ring-2">
            <Search className="size-4 text-muted" />
            <input
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder={mode === "search" ? "Search stories, topics or tags…" : "Filter stories…"}
              aria-label="Search stories"
              autoFocus={mode === "search"}
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted"
            />
            {query && (
              <button onClick={() => updateQuery("")} aria-label="Clear search" className="text-muted hover:text-accent">
                <X className="size-4" />
              </button>
            )}
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort stories"
            className="h-12 rounded-full bg-white px-5 text-[13px] font-medium outline-none ring-accent/30 focus:ring-2"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="quick">Quickest read</option>
          </select>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {["All", ...Object.keys(categoryCounts).sort()].map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setLimit(PAGE);
              }}
              aria-pressed={category === c}
              className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-medium transition ${
                category === c ? "bg-accent text-white shadow-md shadow-accent/25" : "bg-white text-ink-2 hover:text-accent"
              }`}
            >
              {c}
              <span className={`ml-1.5 text-[11px] ${category === c ? "text-white/75" : "text-muted"}`}>
                {c === "All" ? pool.length : categoryCounts[c]}
              </span>
            </button>
          ))}
        </div>

        {mode === "search" && !query && (
          <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
            <span className="text-muted">Popular:</span>
            {popularTags.map((t) => (
              <button
                key={t}
                onClick={() => updateQuery(t)}
                className="rounded-full border border-line bg-white px-3 py-1 font-medium text-ink-2 transition hover:border-accent hover:text-accent"
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {(query || category !== "All") && (
        <p className="mb-4 text-[13px] text-muted" aria-live="polite">
          {results.length} {results.length === 1 ? "story" : "stories"} found
          {query && (
            <>
              {" "}
              for <span className="font-semibold text-foreground">“{query}”</span>
            </>
          )}
        </p>
      )}

      {results.length ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.slice(0, limit).map((p, i) => (
              <div key={p.slug} className="animate-fade-up" style={{ animationDelay: `${(i % PAGE) * 50}ms` }}>
                <PostCard post={p} />
              </div>
            ))}
          </div>
          {results.length > limit && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setLimit((l) => l + PAGE)}
                className="rounded-full bg-white px-6 py-3 text-[13px] font-semibold shadow-sm transition hover:bg-accent hover:text-white"
              >
                Load more stories ({results.length - limit} left)
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState icon={<SearchX className="size-6" />} title="No stories match">
          Try a different word or{" "}
          <button
            onClick={() => {
              updateQuery("");
              setCategory("All");
            }}
            className="font-semibold text-accent hover:underline"
          >
            clear the filters
          </button>
          .
        </EmptyState>
      )}
    </div>
  );
}
