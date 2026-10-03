import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function Ticker({ posts }: { posts: PostMeta[] }) {
  const items = [...posts, ...posts];
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex h-10 max-w-[1390px] items-center gap-4 px-4 lg:px-12">
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-white" />
          </span>
          Latest
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
          <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
            {items.map((p, i) => (
              <li key={i} aria-hidden={i >= posts.length} className="shrink-0">
                <Link
                  href={`/news/${p.slug}`}
                  tabIndex={i >= posts.length ? -1 : undefined}
                  className="flex items-center gap-3 text-[12.5px] text-ink-2 transition hover:text-accent"
                >
                  <span className="font-semibold text-foreground">{p.category}</span>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
