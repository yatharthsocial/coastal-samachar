"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  ChartNoAxesColumn,
  Clapperboard,
  House,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useBookmarks, useStored } from "@/lib/store";
import { formatDate, site } from "@/lib/site";

const nav = [
  { label: "Home", href: "/", icon: House },
  { label: "Video", href: "/video", icon: Clapperboard },
  { label: "Polls", href: "/polls", icon: ChartNoAxesColumn },
  { label: "Magazine", href: "/magazine", icon: BookOpen },
];

type Notice = { slug: string; title: string; date: string; category: string };

export function Header({ latest }: { latest: Notice[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { list } = useBookmarks();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_6px_30px_-12px_rgba(20,20,40,0.18)]" : ""
      }`}
    >
      <div className="mx-auto flex h-[62px] max-w-[1390px] lg:h-[74px] items-center gap-4 px-4 lg:gap-6 lg:px-12">
        <Link href="/" aria-label={`${site.name} home`} className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt={site.name}
            width={561}
            height={223}
            priority
            className="h-10 w-auto sm:h-11 lg:h-14"
          />
        </Link>

        <nav className="ml-2 flex h-full flex-1 items-center gap-1 sm:gap-4 lg:ml-[70px] lg:gap-[52px]">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={`group relative flex h-full shrink-0 items-center gap-3 px-1.5 text-[14px] font-medium transition-colors ${
                  active ? "text-accent" : "text-ink-2 hover:text-accent"
                }`}
              >
                <Icon
                  className="size-[17px] transition-transform group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
                <span className="hidden md:inline">{label}</span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-center rounded-full bg-accent transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </Link>
            );
          })}

          <Link
            href="/saved"
            aria-label={`Saved stories (${list.length})`}
            className="relative ml-auto shrink-0 text-pocket transition hover:scale-110 sm:ml-2 lg:ml-6"
          >
            <ShieldCheck className="size-[18px]" strokeWidth={1.8} />
            {list.length > 0 ? (
              <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pocket px-1 text-[9px] font-bold text-white">
                {list.length}
              </span>
            ) : (
              <span className="absolute -right-1 -top-0.5 size-1 rounded-full bg-pocket" />
            )}
          </Link>

          <Notifications latest={latest} />

          <Link
            href="/search"
            aria-label="Search"
            className="shrink-0 px-1 text-ink-2 md:hidden"
          >
            <Search className="size-[18px]" strokeWidth={1.8} />
          </Link>
        </nav>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q")?.toString().trim();
            router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
          }}
          className="hidden h-9 w-[230px] items-center rounded-full bg-background px-5 ring-accent/30 transition focus-within:bg-white focus-within:ring-2 md:flex lg:w-[310px]"
          role="search"
        >
          <input
            name="q"
            aria-label="Search stories"
            placeholder="Enter search term"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#b4b6c2]"
          />
          <button aria-label="Search">
            <Search className="size-4 text-muted" />
          </button>
        </form>
      </div>
    </header>
  );
}

function Notifications({ latest }: { latest: Notice[] }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useStored<string>("cs-notif-seen", "");
  const ref = useRef<HTMLDivElement>(null);
  const unread = latest.filter((n) => !seen || n.date > seen).length;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative ml-1 shrink-0 sm:ml-2 lg:ml-8">
      <button
        onClick={() => {
          setOpen((o) => !o);
          setSeen(new Date().toISOString());
        }}
        aria-label={`Notifications${unread ? ` (${unread} new)` : ""}`}
        aria-expanded={open}
        className="relative flex text-ink-2 transition hover:text-accent"
      >
        <Bell
          className={`size-[18px] ${unread ? "origin-top animate-[wiggle_1s_ease-in-out_2]" : ""}`}
          strokeWidth={1.8}
        />
        {unread > 0 ? (
          <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
            {unread}
          </span>
        ) : (
          <span className="absolute -right-1 -top-0.5 size-1 rounded-full bg-ink-2" />
        )}
      </button>

      {open && (
        <div className="fixed inset-x-4 top-[70px] z-50 animate-fade-up rounded-2xl border border-line bg-white p-2 shadow-2xl shadow-black/10 sm:absolute sm:inset-x-auto sm:right-0 sm:top-9 sm:w-[340px]">
          <p className="px-3 pb-2 pt-2 text-[13px] font-semibold">Latest stories</p>
          <ul>
            {latest.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/news/${n.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 transition hover:bg-background"
                >
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-accent">
                    {n.category}
                  </span>
                  <span className="mt-0.5 block text-[13px] font-medium leading-snug">
                    {n.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">{formatDate(n.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
