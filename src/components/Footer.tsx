import Image from "next/image";
import Link from "next/link";
import { categories, site, slugify } from "@/lib/site";
import { Newsletter } from "./Newsletter";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-[#16161c] text-white">
      <div className="mx-auto grid max-w-[1390px] gap-12 px-4 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <Image src="/logo.png" alt={site.name} width={561} height={223} className="h-16 w-auto rounded-xl bg-white px-3 py-1.5" />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60">{site.description}</p>
          <div className="mt-6">
            <Newsletter dark />
          </div>
        </div>

        <FooterCol title="Sections">
          {categories.map((c) => (
            <FooterLink key={c} href={`/category/${slugify(c)}`}>
              {c}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Explore">
          <FooterLink href="/magazine">All stories</FooterLink>
          <FooterLink href="/video">Video</FooterLink>
          <FooterLink href="/polls">Polls</FooterLink>
          <FooterLink href="/saved">Saved stories</FooterLink>
          <FooterLink href="/search">Search</FooterLink>
          <FooterLink href="/feed.xml">RSS feed</FooterLink>
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink href="/about">About us</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/contact">Advertise &amp; partner</FooterLink>
          {Object.entries(site.social).map(([name, href]) => (
            <FooterLink key={name} href={href} external>
              {name === "x" ? "X (Twitter)" : name[0].toUpperCase() + name.slice(1)}
            </FooterLink>
          ))}
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1390px] flex-wrap items-center justify-between gap-2 px-4 py-6 text-[12px] text-white/45 lg:px-12">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Made with care on the Karnataka coast.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/40">{title}</p>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const Tag = external || href.endsWith(".xml") ? "a" : Link;
  return (
    <li>
      <Tag
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-[14px] text-white/75 transition hover:text-accent"
      >
        {children}
      </Tag>
    </li>
  );
}
