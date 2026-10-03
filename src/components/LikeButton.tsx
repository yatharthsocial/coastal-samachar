"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useLikes } from "@/lib/store";

export function LikeButton({ slug, showLabel = false }: { slug: string; showLabel?: boolean }) {
  const { has, toggle } = useLikes();
  const liked = has(slug);
  const [burst, setBurst] = useState(0);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (!liked) setBurst((b) => b + 1);
        toggle(slug);
      }}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like this story"}
      className={`flex items-center gap-2 transition ${liked ? "text-accent" : "text-ink-2 hover:text-accent"}`}
    >
      <Heart
        key={burst}
        className={`size-4 ${liked ? "animate-pop fill-accent" : ""}`}
        strokeWidth={1.8}
      />
      {showLabel && <span className="text-[14px] font-semibold">{liked ? "Liked" : "Like"}</span>}
    </button>
  );
}
