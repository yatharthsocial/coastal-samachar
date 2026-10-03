"use client";

import { Bookmark, ShieldCheck } from "lucide-react";
import { useBookmarks } from "@/lib/store";
import { toast } from "./Toaster";

export function BookmarkButton({
  slug,
  variant = "pill",
}: {
  slug: string;
  variant?: "pill" | "icon";
}) {
  const { has, toggle } = useBookmarks();
  const saved = has(slug);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast(toggle(slug) ? "Saved to your pocket" : "Removed from pocket");
  };

  if (variant === "icon") {
    return (
      <button
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? "Remove bookmark" : "Save for later"}
        className={`flex size-9 items-center justify-center rounded-full backdrop-blur transition hover:scale-110 ${
          saved ? "bg-pocket text-white" : "bg-white/90 text-ink-2"
        }`}
      >
        <Bookmark className={`size-4 ${saved ? "fill-white" : ""}`} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium transition active:scale-95 ${
        saved
          ? "border-pocket bg-pocket text-white"
          : "border-pocket text-pocket hover:bg-pocket/10"
      }`}
    >
      <ShieldCheck
        className={`size-3.5 ${saved ? "fill-white text-pocket" : "fill-pocket text-white"}`}
      />
      {saved ? "Saved to pocket" : "Save to pocket"}
    </button>
  );
}
