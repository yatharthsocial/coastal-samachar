import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { site, slugify } from "./site";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  image: string;
  imageAlt: string;
  author: string;
  featured: boolean;
  format: "article" | "video";
  /** Optional YouTube video id, embedded at the top of the article. */
  video?: string;
  /** Optional self-hosted video (e.g. /videos/x.mp4) played at the top of the article. */
  videoFile?: string;
  /** Short, silent clip that loops as the thumbnail on cards. */
  videoPreview?: string;
  /** Display length, e.g. "5:26". */
  videoDuration?: string;
  readingTime: number;
};

export type Heading = { id: string; text: string; level: number };

export type Post = PostMeta & { html: string; headings: Heading[] };

function parseFile(file: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, "");
  const words = content.split(/\s+/).filter(Boolean).length;
  const meta: PostMeta = {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    date: new Date(data.date).toISOString(),
    updated: data.updated ? new Date(data.updated).toISOString() : undefined,
    category: data.category,
    tags: data.tags ?? [],
    image: data.image,
    imageAlt: data.imageAlt ?? data.title,
    author: data.author ?? `${site.name} Desk`,
    featured: Boolean(data.featured),
    format: data.format === "video" ? "video" : "article",
    video: data.video,
    videoFile: data.videoFile,
    videoPreview: data.videoPreview,
    videoDuration: data.videoDuration,
    readingTime: Math.max(2, Math.ceil(words / 200)),
  };
  return { meta, content };
}

const decodeEntities = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

let cache: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  // Cache only in production builds; in `next dev` re-read so new posts show up immediately.
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseFile(f).meta)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return cache;
}

export function getPost(slug: string): Post | undefined {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(POSTS_DIR, file))) return undefined;
  const { meta, content } = parseFile(file);

  const headings: Heading[] = [];
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = decodeEntities(text.replace(/<[^>]+>/g, ""));
        const id = slugify(plain);
        if (depth <= 3) headings.push({ id, text: plain, level: depth });
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
      // External links (client backlinks) open in a new tab and stay "follow".
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith(site.url);
        const t = title ? ` title="${title}"` : "";
        return external
          ? `<a href="${href}"${t} target="_blank" rel="noopener">${text}</a>`
          : `<a href="${href}"${t}>${text}</a>`;
      },
    },
  });

  const html = marked.parse(content, { async: false });
  return { ...meta, html, headings };
}

/** Absolute URL for share previews, structured data and the sitemap. */
export const shareImage = (p: Pick<PostMeta, "image">) =>
  p.image.startsWith("http") ? `${p.image}?w=1200&h=630&fit=crop` : `${site.url}${p.image}`;

export const getPostsByCategory = (category: string) =>
  getAllPosts().filter((p) => p.category === category);

export function getRelatedPosts(post: PostMeta, limit = 3) {
  const score = (p: PostMeta) =>
    (p.category === post.category ? 3 : 0) +
    p.tags.filter((t) => post.tags.includes(t)).length;
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export function getCategoryCounts() {
  const counts: Record<string, number> = {};
  for (const p of getAllPosts()) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}

/** The small, serialisable shape passed to client components. */
export type PostCardData = Pick<
  PostMeta,
  | "slug" | "title" | "excerpt" | "date" | "category" | "tags" | "image" | "imageAlt" | "readingTime" | "format"
  | "videoPreview" | "videoDuration"
>;

export const toCard = (p: PostMeta): PostCardData => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  date: p.date,
  category: p.category,
  tags: p.tags,
  image: p.image,
  imageAlt: p.imageAlt,
  readingTime: p.readingTime,
  format: p.format,
  videoPreview: p.videoPreview,
  videoDuration: p.videoDuration,
});
