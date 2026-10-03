import type { MetadataRoute } from "next";
import { getAllPosts, getCategoryCounts, shareImage } from "@/lib/posts";
import { categories, site, slugify } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const counts = getCategoryCounts();
  const latest = posts[0]?.date ?? new Date().toISOString();

  return [
    { url: site.url, lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/magazine`, lastModified: latest, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/video`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${site.url}/polls`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.3 },
    ...categories
      .filter((c) => counts[c])
      .map((c) => ({
        url: `${site.url}/category/${slugify(c)}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ...posts.map((p) => ({
      url: `${site.url}/news/${p.slug}`,
      lastModified: p.updated ?? p.date,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [shareImage(p)],
    })),
  ];
}
