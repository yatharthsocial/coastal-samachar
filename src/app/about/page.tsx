import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, HeartHandshake, Waves } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name}, Mangaluru's local news site focused on education and culture.`,
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Waves,
    title: "Rooted on the coast",
    text: "We cover education, culture and community life in Mangaluru and coastal Karnataka.",
  },
  {
    icon: BadgeCheck,
    title: "Education first",
    text: "Exam tips, scholarships, career guidance and campus life — practical guides for students and parents, checked against reliable sources.",
  },
  {
    icon: HeartHandshake,
    title: "Reader first",
    text: "No clickbait, no pop-up walls. Just stories worth your time, on a fast and easy-to-read site.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-12 lg:px-12">
      <PageHeader
        eyebrow="About us"
        title={`About ${site.name}`}
        description={site.description}
      />
      <div className="grid gap-6 md:grid-cols-3">
        {values.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 90}>
            <div className="h-full rounded-2xl bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-[17px] font-semibold">{title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6 rounded-2xl bg-white p-8 sm:p-10">
        <div className="prose max-w-none">
          <h2>Work with us</h2>
          <p>
            We publish guest posts, partner features and sponsored stories that are genuinely useful to our readers.
            Every partner story is clearly labelled and held to the same editorial standards as our own.
          </p>
          <p>
            Interested? <Link href="/contact">Get in touch</Link> and tell us about your idea.
          </p>
        </div>
      </Reveal>
    </main>
  );
}
