import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock } from "lucide-react";
import { getAllPosts, getPost, getRelatedPosts, shareImage, toCard } from "@/lib/posts";
import { formatDate, site, slugify } from "@/lib/site";
import { polls } from "@/lib/data";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { BookmarkButton } from "@/components/BookmarkButton";
import { LikeButton } from "@/components/LikeButton";
import { ShareButtons, ShareMenu } from "@/components/ShareMenu";
import { PostCard } from "@/components/PostCard";
import { Poll } from "@/components/Poll";
import { Newsletter } from "@/components/Newsletter";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { SectionTitle } from "@/components/SectionTitle";

export const dynamicParams = false;

/** "5:26" → "PT5M26S" for structured data. */
const isoDuration = (d: string) => {
  const [m, sec] = d.split(":").map(Number);
  return `PT${m}M${sec}S`;
};

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/news/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      section: post.category,
      tags: post.tags,
      images: [{ url: shareImage(post), alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [shareImage(post)],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === post.slug);
  const newer = all[i - 1];
  const older = all[i + 1];
  const related = getRelatedPosts(post);
  const path = `/news/${post.slug}`;
  const poll = polls[i % polls.length];

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsArticle",
              headline: post.title,
              description: post.excerpt,
              image: [shareImage(post)],
              datePublished: post.date,
              dateModified: post.updated ?? post.date,
              articleSection: post.category,
              keywords: post.tags.join(", "),
              author: { "@type": "Organization", name: post.author, url: site.url },
              publisher: { "@type": "Organization", name: site.name, url: site.url },
              mainEntityOfPage: `${site.url}${path}`,
            },
            ...(post.videoFile
              ? [
                  {
                    "@type": "VideoObject",
                    name: post.title,
                    description: post.excerpt,
                    thumbnailUrl: [shareImage(post)],
                    uploadDate: post.date,
                    contentUrl: `${site.url}${post.videoFile}`,
                    ...(post.videoDuration ? { duration: isoDuration(post.videoDuration) } : {}),
                  },
                ]
              : []),
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: post.category,
                  item: `${site.url}/category/${slugify(post.category)}`,
                },
                { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}${path}` },
              ],
            },
          ],
        }}
      />

      <main className="mx-auto w-full max-w-[1390px] px-4 pb-10 pt-10 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="size-3" />
          <Link href={`/category/${slugify(post.category)}`} className="hover:text-accent">
            {post.category}
          </Link>
          <ChevronRight className="size-3" />
          <span className="line-clamp-1 text-ink-2">{post.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-[34px]">
          <article className="min-w-0">
            <header className="animate-fade-up">
              <Link
                href={`/category/${slugify(post.category)}`}
                className="inline-block rounded-full bg-accent-soft px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent transition hover:bg-accent hover:text-white"
              >
                {post.category}
              </Link>
              <h1 className="mt-4 max-w-[820px] text-[30px] font-bold leading-[1.2] tracking-tight sm:text-[40px]">
                {post.title}
              </h1>
              <p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-ink-2">{post.excerpt}</p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#ff9a6b] text-[13px] font-bold text-white">
                    {post.author[0]}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold">{post.author}</p>
                    <p className="flex flex-wrap items-center gap-3 text-[12px] text-muted">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {post.readingTime} min read
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <LikeButton slug={post.slug} showLabel />
                  <ShareMenu path={path} title={post.title} />
                  <BookmarkButton slug={post.slug} />
                </div>
              </div>
            </header>

            <div className="mt-8 animate-fade-up overflow-hidden rounded-2xl bg-white p-2 [animation-delay:120ms]">
              {post.videoFile ? (
                <div className="overflow-hidden rounded-xl bg-black">
                  <video
                    src={post.videoFile}
                    poster={post.image}
                    controls
                    playsInline
                    preload="metadata"
                    className="block h-auto w-full bg-black"
                  >
                    Your browser does not support HTML video.{" "}
                    <a href={post.videoFile}>Download the video</a>.
                  </video>
                </div>
              ) : post.video ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${post.video}`}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="aspect-video w-full rounded-xl"
                />
              ) : (
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  width={1400}
                  height={800}
                  priority
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                />
              )}
            </div>

            <div className="mt-8 rounded-2xl bg-white px-6 py-10 sm:px-12">
              <div className="prose mx-auto max-w-[720px]" dangerouslySetInnerHTML={{ __html: post.html }} />

              <div className="mx-auto mt-12 max-w-[720px] space-y-8 border-t border-line pt-8">
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/search?q=${encodeURIComponent(t)}`}
                        className="rounded-full bg-background px-3.5 py-1.5 text-[12px] font-medium text-ink-2 transition hover:bg-accent hover:text-white"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                )}
                <div>
                  <p className="mb-3 text-[13px] font-semibold">Share this story</p>
                  <ShareButtons path={path} title={post.title} />
                </div>
              </div>
            </div>

            {(newer || older) && (
              <nav aria-label="More stories" className="mt-6 grid gap-4 sm:grid-cols-2">
                {older ? (
                  <Link href={`/news/${older.slug}`} className="group rounded-2xl bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                      <ArrowLeft className="size-3.5 transition group-hover:-translate-x-1" /> Previous
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold leading-snug group-hover:text-accent">{older.title}</span>
                  </Link>
                ) : <span />}
                {newer && (
                  <Link href={`/news/${newer.slug}`} className="group rounded-2xl bg-white p-6 text-right transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
                    <span className="flex items-center justify-end gap-1.5 text-[12px] font-semibold text-muted">
                      Next <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold leading-snug group-hover:text-accent">{newer.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-[90px] lg:self-start">
            <TableOfContents headings={post.headings} />
            <Poll poll={poll} compact />
            <div className="rounded-2xl bg-[#16161c] p-6 text-white">
              <p className="text-[16px] font-semibold">Enjoyed this story?</p>
              <p className="mt-1 text-[13px] text-white/60">Get the best of the coast in your inbox.</p>
              <div className="mt-4">
                <Newsletter dark />
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <SectionTitle bold="You may" light="also like" seeAllHref={`/category/${slugify(post.category)}`} />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, n) => (
                <Reveal key={p.slug} delay={n * 90}>
                  <PostCard post={toCard(p)} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
