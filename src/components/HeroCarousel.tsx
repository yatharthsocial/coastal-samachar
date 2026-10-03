"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { PostCardData } from "@/lib/posts";
import { BookmarkButton } from "./BookmarkButton";
import { LikeButton } from "./LikeButton";
import { ShareMenu } from "./ShareMenu";

export function HeroCarousel({ posts }: { posts: PostCardData[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback(
    (i: number) => setIndex((i + posts.length) % posts.length),
    [posts.length],
  );

  useEffect(() => {
    if (paused || posts.length < 2) return;
    const t = setTimeout(() => go(index + 1), 6000);
    return () => clearTimeout(t);
  }, [index, paused, go, posts.length]);

  const post = posts[index];

  return (
    <article
      className="group rounded-2xl bg-white p-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative overflow-hidden rounded-xl">
        {posts.map((p, i) => (
          <Link
            key={p.slug}
            href={`/news/${p.slug}`}
            tabIndex={i === index ? 0 : -1}
            aria-hidden={i !== index}
            className={`block transition-opacity duration-700 ${
              i === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            }`}
          >
            <Image
              src={p.image}
              alt={p.imageAlt}
              width={1300}
              height={800}
              priority={i === 0}
              sizes="(min-width: 1024px) 660px, 100vw"
              className={`aspect-[652/403] w-full object-cover transition duration-[6000ms] ease-linear ${
                i === index && !paused ? "scale-105" : "scale-100"
              }`}
            />
          </Link>
        ))}

        {posts.length > 1 && (
          <>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-4 pt-12">
              <div className="flex gap-1.5">
                {posts.map((p, i) => (
                  <button
                    key={p.slug}
                    onClick={() => go(i)}
                    aria-label={`Show story ${i + 1}`}
                    aria-current={i === index}
                    className="relative h-1.5 overflow-hidden rounded-full bg-white/40 transition-all"
                    style={{ width: i === index ? 36 : 12 }}
                  >
                    {i === index && (
                      <span
                        key={`${index}-${paused}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-white"
                        style={{
                          width: paused ? "100%" : undefined,
                          animation: paused ? undefined : "progress 6s linear forwards",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => go(index - 1)}
                  aria-label="Previous story"
                  className="flex size-9 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => go(index + 1)}
                  aria-label="Next story"
                  className="flex size-9 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div key={post.slug} className="animate-fade-up px-6 pb-5 pt-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-accent-soft px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
            {post.category}
          </span>
          <div className="flex items-center gap-6 text-[14px] font-semibold">
            <span className="flex items-center gap-2.5 text-ink-2">
              <Clock className="size-4 text-muted" strokeWidth={1.6} />
              {post.readingTime} min
            </span>
            <LikeButton slug={post.slug} showLabel />
            <ShareMenu path={`/news/${post.slug}`} title={post.title} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-[420px] text-[21px] font-semibold leading-[1.5]">
            <Link href={`/news/${post.slug}`} className="transition hover:text-accent">
              {post.title}
            </Link>
          </h2>
          <BookmarkButton slug={post.slug} />
        </div>
      </div>
    </article>
  );
}
