"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Share2 } from "lucide-react";
import { toast } from "./Toaster";

function targets(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { name: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, color: "#25d366" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, color: "#1877f2" },
    { name: "X", href: `https://x.com/intent/post?url=${u}&text=${t}`, color: "#111" },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, color: "#0a66c2" },
  ];
}

const absolute = (path: string) => new URL(path, window.location.origin).toString();

async function copy(path: string) {
  await navigator.clipboard.writeText(absolute(path));
  toast("Link copied to clipboard");
}

/** Compact icon that opens a share popover. */
export function ShareMenu({ path, title }: { path: string; title: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url: absolute(path) });
      } catch {}
      return;
    }
    setOpen((o) => !o);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onClick}
        aria-label="Share"
        aria-expanded={open}
        className="flex items-center gap-2 text-ink-2 transition hover:text-accent"
      >
        <Share2 className="size-4" strokeWidth={1.6} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 w-48 animate-fade-up rounded-2xl border border-line bg-white p-2 shadow-xl shadow-black/5">
          {targets(absolute(path), title).map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium hover:bg-background"
            >
              <span className="size-2.5 rounded-full" style={{ background: s.color }} />
              {s.name}
            </a>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              copy(path);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium hover:bg-background"
          >
            <Link2 className="size-3.5" /> Copy link
          </button>
        </div>
      )}
    </div>
  );
}

/** Row of round share buttons for the article page. */
export function ShareButtons({ path, title }: { path: string; title: string }) {
  const [url, setUrl] = useState(path);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setUrl(absolute(path)), [path]);

  return (
    <div className="flex flex-wrap gap-2">
      {targets(url, title).map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${s.name}`}
          className="flex h-9 items-center rounded-full px-4 text-[12px] font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: s.color }}
        >
          {s.name}
        </a>
      ))}
      <button
        onClick={() => copy(path)}
        className="flex h-9 items-center gap-2 rounded-full border border-line bg-white px-4 text-[12px] font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <Link2 className="size-3.5" /> Copy link
      </button>
    </div>
  );
}
