import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StoryBrowser } from "@/components/StoryBrowser";
import { getAllPosts, toCard } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Magazine – All Stories",
  description: `Every story, guide and explainer published on ${site.name}, sorted and searchable.`,
  alternates: { canonical: "/magazine" },
};

export default function MagazinePage() {
  const posts = getAllPosts().map(toCard);
  return (
    <main className="mx-auto w-full max-w-[1390px] px-4 pb-10 pt-12 lg:px-12">
      <PageHeader
        eyebrow="Magazine"
        title="All stories"
        description="Explainers, guides and features from the coast. Filter by section or find exactly what you need."
      />
      <Suspense>
        <StoryBrowser posts={posts} />
      </Suspense>
    </main>
  );
}
