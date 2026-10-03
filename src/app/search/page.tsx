import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StoryBrowser } from "@/components/StoryBrowser";
import { getAllPosts, toCard } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every story on Coastal Samachar.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  const posts = getAllPosts().map(toCard);
  return (
    <main className="mx-auto w-full max-w-[1390px] px-4 pb-10 pt-12 lg:px-12">
      <PageHeader eyebrow="Search" title="Find a story" description="Results update as you type." />
      <Suspense>
        <StoryBrowser posts={posts} mode="search" />
      </Suspense>
    </main>
  );
}
