import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { PostCardData } from "@/lib/posts";
import { formatDate, slugify } from "@/lib/site";
import { BookmarkButton } from "./BookmarkButton";
import { LoopingPreview, VideoOverlay } from "./VideoThumb";

export function PostCard({ post, priority }: { post: PostCardData; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-2 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(20,20,40,0.25)]">
      <div className="relative overflow-hidden rounded-xl">
        {post.videoPreview ? (
          <LoopingPreview
            src={post.videoPreview}
            poster={post.image}
            className="aspect-[16/10] w-full transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={post.image}
            alt={post.imageAlt}
            width={640}
            height={400}
            priority={priority}
            sizes="(min-width: 1024px) 400px, 100vw"
            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {post.format === "video" && <VideoOverlay duration={post.videoDuration} />}
        <div className="absolute right-3 top-3 z-10">
          <BookmarkButton slug={post.slug} variant="icon" />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <Link
          href={`/category/${slugify(post.category)}`}
          className="relative z-10 w-fit text-[11px] font-semibold uppercase tracking-[0.12em] text-accent hover:underline"
        >
          {post.category}
        </Link>
        <h3 className="mt-2 text-[17px] font-semibold leading-snug">
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted">{post.excerpt}</p>
        <p className="mt-auto flex items-center gap-3 pt-4 text-[12px] text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="size-1 rounded-full bg-[#d0d2dc]" />
          <span className="flex items-center gap-1">
            <Clock className="size-3" /> {post.readingTime} min read
          </span>
        </p>
      </div>
    </article>
  );
}
