import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SectionTitle } from "@/components/SectionTitle";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PostCard } from "@/components/PostCard";
import { Poll } from "@/components/Poll";
import { Newsletter } from "@/components/Newsletter";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { SchoolSpotlight } from "@/components/SchoolSpotlight";
import { LoopingPreview, VideoOverlay } from "@/components/VideoThumb";
import { getAllPosts, toCard } from "@/lib/posts";
import { polls } from "@/lib/data";
import { site } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts();
  const featured = posts.filter((p) => p.featured).slice(0, 6);
  const hero = featured.length ? featured : posts.slice(0, 3);
  // Self-hosted videos (with a looping preview) come first.
  const videos = posts
    .filter((p) => p.format === "video")
    .sort((a, b) => Number(Boolean(b.videoFile)) - Number(Boolean(a.videoFile)))
    .slice(0, 2);
  const politics = posts.filter((p) => p.category === "Politics");
  // Prefer politics stories not already in the carousel, but always show at least two.
  const political = [
    ...politics.filter((p) => !hero.includes(p)),
    ...politics.filter((p) => hero.includes(p)),
  ].slice(0, 3);
  const isAlvas = (p: (typeof posts)[number]) => p.tags.some((t) => t.startsWith("alvas")) || /alva/i.test(p.title);
  // Alva's stories lead the Education Corner.
  const eduAll = posts
    .filter((p) => p.category === "Education" && !hero.includes(p))
    .sort((a, b) => Number(isAlvas(b)) - Number(isAlvas(a)));
  // Full rows of three look tidier than a lone card on the last row.
  const education = eduAll.slice(0, Math.min(6, Math.floor(eduAll.length / 3) * 3 || eduAll.length));
  const cultureEvents = posts
    .filter((p) => (p.category === "Culture" || p.category === "Events") && !hero.includes(p))
    .slice(0, 3);

  return (
    <main className="mx-auto flex w-full max-w-[1390px] flex-col gap-8 px-4 pb-10 pt-12 lg:flex-row lg:gap-[34px] lg:px-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          potentialAction: {
            "@type": "SearchAction",
            target: `${site.url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <h1 className="sr-only">{site.name} – today&apos;s headlines and stories</h1>

      <Sidebar />

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-[34px] gap-y-10 lg:grid-cols-[minmax(0,1fr)_385px]">
        {/* Today's headlines */}
        <section className="animate-fade-up">
          <SectionTitle bold="Todays" light="Headlines" />
          <HeroCarousel posts={hero.map(toCard)} />
        </section>

        {/* Political news */}
        <section className="flex animate-fade-up flex-col gap-8 [animation-delay:120ms]">
          <div>
          <SectionTitle bold="Political" light="News" seeAllHref="/category/politics" />
          <ul className="flex flex-col gap-4">
            {political.map((n) => (
              <li key={n.slug}>
                <Link href={`/news/${n.slug}`} className="group flex items-center gap-[18px]">
                  <span className="shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={n.image}
                      alt={n.imageAlt}
                      width={134}
                      height={134}
                      className="size-[67px] object-cover transition duration-500 group-hover:scale-110"
                    />
                  </span>
                  <span className="text-[15px] font-semibold leading-[1.45] transition group-hover:text-accent">
                    {n.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          </div>
          <Poll poll={polls[0]} compact />
        </section>

        {/* Alva's English Medium High School spotlight */}
        <Reveal as="section" className="lg:col-span-2">
          <SchoolSpotlight />
        </Reveal>

        {/* Video */}
        <Reveal as="section">
          <SectionTitle bold="Video" seeAllHref="/video" />
          <div className="grid gap-[18px] sm:grid-cols-2">
            {videos.map((v) => (
              <Link
                key={v.slug}
                href={`/news/${v.slug}`}
                className="group relative block overflow-hidden rounded-xl"
              >
                {v.videoPreview ? (
                  <LoopingPreview
                    src={v.videoPreview}
                    poster={v.image}
                    className="aspect-[326/152] w-full transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <Image
                    src={v.image}
                    alt={v.imageAlt}
                    width={650}
                    height={304}
                    sizes="(min-width: 1024px) 330px, 100vw"
                    className="aspect-[326/152] w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                )}
                <VideoOverlay duration={v.videoDuration} size="sm" />
                <span className="absolute inset-x-3 bottom-3 translate-y-2 text-[13px] font-semibold leading-snug text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  {v.title}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Newsletter */}
        <Reveal delay={100}>
          <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-[#ff8a5c] p-8 text-white">
            <span className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
            <span className="absolute -bottom-16 right-10 size-32 rounded-full bg-white/10" />
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
              Newsletter
            </p>
            <h2 className="relative mt-2 text-[24px] font-bold leading-tight">
              The coast, in your inbox every morning.
            </h2>
            <p className="relative mt-2 text-[14px] text-white/80">
              One short email with the stories worth your time. No spam, ever.
            </p>
            <div className="relative mt-6">
              <Newsletter />
            </div>
          </div>
        </Reveal>

        {/* Education — the main focus */}
        <section className="lg:col-span-2">
          <Reveal>
            <SectionTitle bold="Education" light="Corner" seeAllHref="/category/education" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {education.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <PostCard post={toCard(p)} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Culture & events */}
        {cultureEvents.length > 0 && (
          <section className="lg:col-span-2">
            <Reveal>
              <SectionTitle bold="Culture" light="& Events" seeAllHref="/category/culture" />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {cultureEvents.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 90}>
                  <PostCard post={toCard(p)} />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8 flex justify-center">
              <Link
                href="/magazine"
                className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold shadow-sm transition hover:bg-accent hover:text-white"
              >
                Browse all stories
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </section>
        )}

      </div>
    </main>
  );
}
