// Site-wide settings. Set NEXT_PUBLIC_SITE_URL to the live domain before
// deploying so canonical URLs, the sitemap and the RSS feed point to it.
export const site = {
  name: "Coastal Samachar",
  shortName: "NEWS",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.coastalsamachar.com").replace(/\/$/, ""),
  description:
    "Coastal Samachar is Mangaluru's education and culture news site — Alva's English Medium High School, SSLC and II PUC results and toppers, Alva's Nudisiri-Virasat, and news from coastal Karnataka.",
  locale: "en_IN",
  email: "hello@coastalsamachar.com",
  social: {
    x: "https://x.com/",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
};

// Order matters: it's the order shown in menus. Education is the main focus.
export const categories = ["Education", "Coastal", "Culture", "Politics", "Events", "Sports"];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const categoryFromSlug = (slug: string) =>
  categories.find((c) => slugify(c) === slug);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
