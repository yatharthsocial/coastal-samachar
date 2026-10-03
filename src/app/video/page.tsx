import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clapperboard, Clock, Play } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { LoopingPreview, VideoOverlay } from "@/components/VideoThumb";
import { getAllPosts, toCard } from "@/lib/posts";
import { formatDate, slugify } from "@/lib/site";

export const metadata: Metadata = {
  title: "Video Stories",
  description: "Watch video stories from Mangaluru and coastal Karnataka — schools, education, culture and events.",
  alternates: { canonical: "/video" },
};

export default function VideoPage() {
  const videos = getAllPosts()
    .filter((p) => p.format === "video")
    .sort((a, b) => Number(Boolean(b.videoFile)) - Number(Boolean(a.videoFile)));
  const [featured, ...rest] = videos;

  return (
    <main className="mx-auto w-full max-w-[1390px] px-4 pb-10 pt-12 lg:px-12">
      <PageHeader eyebrow="Watch" title="Video" description="Video stories from schools, campuses and events across the coast." />

      {!featured ? (
        <EmptyState icon={<Clapperboard className="size-6" />} title="No videos yet" />
      ) : (
        <>
          <article className="group relative grid animate-fade-up overflow-hidden rounded-3xl bg-[#16161c] text-white lg:grid-cols-[1.5fr_1fr]">
            <Link href={`/news/${featured.slug}`} className="relative block overflow-hidden" aria-label={`Watch: ${featured.title}`}>
              {featured.videoPreview ? (
                <LoopingPreview
                  src={featured.videoPreview}
                  poster={featured.image}
                  className="aspect-video h-full w-full transition duration-700 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  width={1200}
                  height={675}
                  priority
                  className="aspect-video h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              )}
              <VideoOverlay duration={featured.videoDuration} size="lg" />
            </Link>
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
              <Link
                href={`/category/${slugify(featured.category)}`}
                className="w-fit rounded-full bg-accent px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                {featured.category}
              </Link>
              <h2 className="text-[24px] font-bold leading-tight sm:text-[30px]">
                <Link href={`/news/${featured.slug}`} className="transition hover:text-accent">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-[14.5px] leading-relaxed text-white/65">{featured.excerpt}</p>
              <p className="flex items-center gap-4 text-[12.5px] text-white/50">
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                {featured.videoDuration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {featured.videoDuration}
                  </span>
                )}
              </p>
              <Link
                href={`/news/${featured.slug}`}
                className="mt-2 flex w-fit items-center gap-2.5 rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-[#16161c] transition hover:bg-accent hover:text-white"
              >
                <Play className="size-4 fill-current" /> Watch now
              </Link>
            </div>
          </article>

          {rest.length > 0 && (
            <section className="mt-14">
              <Reveal>
                <SectionTitle bold="More" light="videos" />
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 3) * 90}>
                    <PostCard post={toCard(p)} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
