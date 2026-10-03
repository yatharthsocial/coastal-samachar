import { Play } from "lucide-react";

/** Silent looping preview clip used as a video thumbnail. */
export function LoopingPreview({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className={`object-cover ${className}`}
    />
  );
}

/** Play button + duration badge layered over a video thumbnail. */
export function VideoOverlay({ duration, size = "md" }: { duration?: string; size?: "sm" | "md" | "lg" }) {
  const btn = size === "lg" ? "size-16" : size === "sm" ? "size-9" : "size-11";
  const icon = size === "lg" ? "size-5" : size === "sm" ? "size-2.5" : "size-3.5";
  return (
    <>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <span
        className={`absolute left-1/2 top-1/2 flex ${btn} -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-xl shadow-black/20 transition group-hover:scale-110`}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-white/50 opacity-0 group-hover:opacity-100" />
        <Play className={`relative ${icon} translate-x-px fill-black`} />
      </span>
      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur">
        <span className="size-1.5 animate-pulse rounded-full bg-accent" />
        Video
      </span>
      {duration && (
        <span className="absolute bottom-3 right-3 rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur">
          {duration}
        </span>
      )}
    </>
  );
}
