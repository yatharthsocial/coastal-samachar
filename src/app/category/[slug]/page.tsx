import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Newspaper } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getPostsByCategory, toCard } from "@/lib/posts";
import { categories, categoryFromSlug, site, slugify } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: slugify(c) }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return {};
  const hasPosts = getPostsByCategory(category).length > 0;
  return {
    title: `${category} News & Stories`,
    description: `The latest ${category.toLowerCase()} stories, explainers and guides from ${site.name}.`,
    alternates: { canonical: `/category/${slug}` },
    // Empty sections are thin pages; keep them out of search until they have stories.
    robots: hasPosts ? undefined : { index: false, follow: true },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();
  const posts = getPostsByCategory(category);

  return (
    <main className="mx-auto flex w-full max-w-[1390px] flex-col gap-8 px-4 pb-10 pt-12 lg:flex-row lg:gap-[34px] lg:px-12">
      <Sidebar active={category} />
      <div className="min-w-0 flex-1">
        <PageHeader
          eyebrow="Category"
          title={category}
          description={`${posts.length} ${posts.length === 1 ? "story" : "stories"} in ${category}.`}
        />
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <PostCard post={toCard(p)} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState icon={<Newspaper className="size-6" />} title="No stories here yet">
            We&apos;re working on it. In the meantime,{" "}
            <Link href="/magazine" className="font-semibold text-accent hover:underline">
              browse all stories
            </Link>
            .
          </EmptyState>
        )}
      </div>
    </main>
  );
}
