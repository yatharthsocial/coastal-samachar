import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Trophy,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { faqs, facilities, highlights, school, sslcHistory } from "@/lib/alvas";
import { getAllPosts, toCard } from "@/lib/posts";
import { site } from "@/lib/site";

const title = "Alva's English Medium High School, Moodbidri – Admissions, SSLC Results & Facilities";
const description =
  "Alva's English Medium High School, Moodbidri (Alva's Education Foundation): 100% SSLC pass record, classes of 35, IIT foundation coaching, hostels, sports quota admissions and contact details.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Alva's English Medium High School",
    "Alva's High School Moodbidri",
    "Alva's School",
    "best school in Mangalore",
    "best high school in Moodbidri",
    "Alva's SSLC result",
    "Alva's Education Foundation",
  ],
  alternates: { canonical: school.path },
  openGraph: {
    type: "website",
    url: school.path,
    title,
    description,
    images: [{ url: school.image, alt: `${school.name} building, Moodbidri` }],
  },
};

export default function AlvasHighSchoolPage() {
  const alvasPosts = getAllPosts()
    .filter((p) => p.tags.some((t) => t.startsWith("alvas")) || /alva/i.test(p.title))
    .slice(0, 6);
  const url = `${site.url}${school.path}`;

  return (
    <main className="mx-auto w-full max-w-[1390px] px-4 pb-10 pt-10 lg:px-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "HighSchool",
              "@id": `${url}#school`,
              name: school.name,
              alternateName: school.shortName,
              url: school.officialUrl,
              image: `${site.url}${school.image}`,
              foundingDate: "2011",
              telephone: school.phones[0],
              email: school.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: school.address.street,
                addressLocality: school.address.locality,
                addressRegion: school.address.region,
                postalCode: school.address.postalCode,
                addressCountry: "IN",
              },
              parentOrganization: { "@type": "EducationalOrganization", name: school.foundation, url: school.foundationUrl },
              sameAs: [school.officialUrl],
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                { "@type": "ListItem", position: 2, name: school.name, item: url },
              ],
            },
          ],
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-[12.5px] text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <ChevronRight className="size-3" />
        <span className="text-ink-2">{school.name}</span>
      </nav>

      {/* Hero */}
      <section className="grid animate-fade-up items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
            <Award className="size-3.5" /> School profile · Moodbidri
          </p>
          <h1 className="mt-5 text-[34px] font-bold leading-[1.12] tracking-tight sm:text-[46px]">
            Alva&apos;s English Medium High School
          </h1>
          <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-ink-2">
            Run by {school.foundation} in Moodbidri, Dakshina Kannada, {school.name} combines a{" "}
            <strong className="text-foreground">100% SSLC pass record</strong>, small classes and IIT foundation coaching
            with sport, arts and culture — a popular choice for families in and around Mangaluru.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${school.phones[0].replace(/\s/g, "")}`}
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-accent/25 transition hover:-translate-y-0.5"
            >
              <Phone className="size-4" /> Admissions: {school.phones[0]}
            </a>
            <a
              href={school.officialUrl}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold transition hover:text-accent"
            >
              Official website <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl bg-black shadow-2xl shadow-black/10">
          <video
            src={school.video}
            poster={school.image}
            controls
            playsInline
            preload="metadata"
            className="block h-auto w-full"
            aria-label={`Video tour of ${school.name}`}
          />
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {highlights.map((h, i) => (
          <Reveal key={h.label} delay={i * 80}>
            <div className="rounded-2xl bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
              <p className="text-[30px] font-bold text-accent">{h.value}</p>
              <p className="mt-1 text-[13px] text-muted">{h.label}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[34px]">
        <div className="min-w-0 space-y-14">
          {/* About */}
          <Reveal as="section">
            <SectionTitle bold="About" light="the school" />
            <div className="prose max-w-none rounded-2xl bg-white p-7 sm:p-10">
              <p>
                {school.name} began in the {school.established} academic year on the Alva&apos;s Education Foundation
                campus in Moodbidri. The foundation, chaired by {school.chairman}, runs schools, PU colleges and
                professional colleges on the same campus, and is known across Karnataka for its cultural festivals,{" "}
                <em>Alva&apos;s Nudisiri</em> and <em>Alva&apos;s Virasat</em>.
              </p>
              <p>
                The school&apos;s mission is to provide quality education anchored in cultural values and patriotism, while
                developing progressive, globally minded young people. In the words of the school:{" "}
                <em>&ldquo;Knowledge is like a garden; if it is not cultivated it cannot be harvested.&rdquo;</em>
              </p>
            </div>
          </Reveal>

          {/* Facilities */}
          <Reveal as="section">
            <SectionTitle bold="Facilities" light="& programmes" />
            <div className="grid gap-4 sm:grid-cols-2">
              {facilities.map((f) => (
                <div key={f.title} className="flex gap-4 rounded-2xl bg-white p-6 transition hover:shadow-lg hover:shadow-black/5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <BookOpenCheck className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold">{f.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Results */}
          <Reveal as="section">
            <SectionTitle bold="SSLC" light="results" />
            <div className="mb-4 flex items-start gap-4 rounded-2xl bg-gradient-to-br from-accent to-[#ff8a5c] p-6 text-white">
              <Trophy className="mt-0.5 size-6 shrink-0" />
              <p className="text-[15px] leading-relaxed">
                <strong>SSLC 2026:</strong> Shadhvi P V of Alva&apos;s School, Moodbidri, scored <strong>622 / 625</strong>,
                as Dakshina Kannada topped Karnataka with a 98.40% pass rate.{" "}
                <Link href="/news/alvas-school-sslc-2026-result" className="font-semibold underline underline-offset-2">
                  Read more
                </Link>
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl bg-white p-2">
              <table className="w-full min-w-[560px] text-left text-[14px]">
                <thead>
                  <tr className="text-[12px] uppercase tracking-[0.08em] text-muted">
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold">Students</th>
                    <th className="px-4 py-3 font-semibold">Distinctions</th>
                    <th className="px-4 py-3 font-semibold">Topper</th>
                    <th className="px-4 py-3 font-semibold">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {sslcHistory.map((r) => (
                    <tr key={r.year} className="border-t border-line transition hover:bg-background">
                      <td className="px-4 py-3 font-semibold">{r.year}</td>
                      <td className="px-4 py-3">{r.students}</td>
                      <td className="px-4 py-3">{r.distinctions}</td>
                      <td className="px-4 py-3">{r.topper}</td>
                      <td className="px-4 py-3 font-semibold text-accent">{r.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[12px] text-muted">
              Earlier batches, 100% pass each year, as published on the{" "}
              <a href={school.officialUrl} target="_blank" rel="noopener" className="underline hover:text-accent">
                school&apos;s official website
              </a>
              .
            </p>
          </Reveal>

          {/* Admissions */}
          <Reveal as="section">
            <SectionTitle bold="Admissions" light="& sports quota" />
            <div className="prose max-w-none rounded-2xl bg-white p-7 sm:p-10">
              <p>
                For admission to {school.name}, contact the school office on <strong>{school.phones[0]}</strong> or email{" "}
                <a href={`mailto:${school.email}`}>{school.email}</a>. Local students are eligible for a special fee
                concession, and a vacation crash course is held for students promoted to Standard IX.
              </p>
              <h3>Sports quota</h3>
              <ul>
                <li>Notifications are published in newspapers in <strong>March–April</strong>.</li>
                <li>Open to <strong>Standards 8 to 10</strong>, in athletics (boys and girls) and basketball (girls).</li>
                <li>Apply with a filled bio-data form and attested copies of certificates.</li>
                <li>Shortlisted students attend a 20-day selection camp with boarding and coaching.</li>
                <li>Selected students receive free food, accommodation and coaching.</li>
              </ul>
            </div>
          </Reveal>

          {/* After high school */}
          <Reveal as="section">
            <SectionTitle bold="After" light="SSLC at Alva's" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/news/alvas-pu-college-disha-tops-karnataka-commerce-2026" className="group rounded-2xl bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Alva&apos;s PU College</p>
                <p className="mt-2 text-[16px] font-semibold leading-snug group-hover:text-accent">
                  II PUC 2026: Alva&apos;s Disha tops Karnataka in Commerce with 600/600
                </p>
              </Link>
              <Link href="/news/alvas-nudisiri-virasat-2027" className="group rounded-2xl bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Culture</p>
                <p className="mt-2 text-[16px] font-semibold leading-snug group-hover:text-accent">
                  Alva&apos;s Nudisiri-Virasat 2027: 6–10 January in Moodbidri
                </p>
              </Link>
            </div>
          </Reveal>

          {/* FAQ */}
          <Reveal as="section">
            <SectionTitle bold="Frequently" light="asked questions" />
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl bg-white px-6 py-5 open:shadow-lg open:shadow-black/5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                    {f.q}
                    <ChevronDown className="size-4 shrink-0 text-muted transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-[90px] lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-white">
            <Image src={school.image} alt={`${school.name} building, Moodbidri`} width={854} height={398} className="w-full" />
            <dl className="divide-y divide-line px-6 py-2 text-[13.5px]">
              {[
                ["Established", school.established],
                ["Medium", "English"],
                ["Exam", "SSLC (Class 10)"],
                ["Timings", school.timings],
                ["Chairman", school.chairman],
                ["Headmistress", school.headmistress],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl bg-[#16161c] p-6 text-white">
            <p className="text-[16px] font-semibold">Contact the school</p>
            <ul className="mt-4 space-y-3 text-[13.5px] text-white/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                {school.address.street}, {school.address.locality} – {school.address.postalCode}, {school.address.district}
              </li>
              {school.phones.slice(0, 2).map((p) => (
                <li key={p} className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                  <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-white">{p}</a>
                </li>
              ))}
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <a href={`mailto:${school.email}`} className="hover:text-white">{school.email}</a>
              </li>
            </ul>
            <a
              href={school.officialUrl}
              target="_blank"
              rel="noopener"
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-[13px] font-semibold transition hover:brightness-110"
            >
              Visit alvasschools.com <ArrowUpRight className="size-4" />
            </a>
          </div>
        </aside>
      </div>

      {alvasPosts.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <SectionTitle bold="Latest" light="from Alva's" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {alvasPosts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <PostCard post={toCard(p)} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
