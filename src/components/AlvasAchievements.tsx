import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, Medal, Music, Shield, Sparkles, Trophy } from "lucide-react";
import { achievements } from "@/lib/alvas";

const icons: Record<string, typeof Trophy> = {
  Sports: Medal,
  SSLC: Trophy,
  "II PUC": Sparkles,
  "JEE Advanced": BookOpenCheck,
  Defence: Shield,
  Culture: Music,
};

export function AlvasAchievements() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {achievements.map((a) => {
        const Icon = icons[a.area] ?? Trophy;
        return (
          <Link
            key={a.area}
            href={a.href}
            className="group relative flex gap-4 overflow-hidden rounded-2xl bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(20,20,40,0.25)]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{a.area}</span>
              <span className="mt-0.5 block text-[19px] font-bold leading-tight text-foreground">{a.value}</span>
              <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">{a.text}</span>
            </span>
            <ArrowUpRight className="absolute right-4 top-4 size-4 text-muted opacity-0 transition group-hover:opacity-100" />
          </Link>
        );
      })}
    </div>
  );
}
