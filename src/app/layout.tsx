import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { BackToTop } from "@/components/BackToTop";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – Today's Headlines`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${site.name} RSS` }] },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: `${site.name} – Today's Headlines`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const latest = getAllPosts().slice(0, 6);
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="sr-only z-[80] rounded-full bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header
          latest={latest.slice(0, 5).map(({ slug, title, date, category }) => ({ slug, title, date, category }))}
        />
        <Ticker posts={latest} />
        <div id="content" className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster />
        <BackToTop />
      </body>
    </html>
  );
}
