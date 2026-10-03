import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StoryBrowser } from "@/components/StoryBrowser";
import { getAllPosts, toCard } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Saved Stories",
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  const posts = getAllPosts().map(toCard);
  return (
    <main className="mx-auto w-full max-w-[1390px] px-4 pb-10 pt-12 lg:px-12">
      <PageHeader
        eyebrow="Your pocket"
        title="Saved stories"
        description="Stories you've saved on this device. They stay here until you remove them."
      />
      <Suspense>
        <StoryBrowser posts={posts} mode="saved" />
      </Suspense>
    </main>
  );
}
