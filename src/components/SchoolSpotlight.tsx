import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { highlights, school } from "@/lib/alvas";
import { LoopingPreview } from "./VideoThumb";

export function SchoolSpotlight() {
  return (
    <Link
      href={school.path}
      className="group grid overflow-hidden rounded-3xl bg-[#16161c] text-white lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="relative overflow-hidden">
        <LoopingPreview
          src={school.videoPreview}
          poster={school.image}
          className="aspect-[854/398] h-full w-full transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em]">
          <Trophy className="size-3.5" /> School spotlight
        </span>
      </div>
      <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">Moodbidri · Since 2011</p>
          <h2 className="mt-2 text-[26px] font-bold leading-tight sm:text-[32px]">{school.name}</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">
            100% SSLC results, classes of 35, IIT foundation coaching, hostels and a 400 m track — on the Alva&apos;s
            Education Foundation campus.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          {highlights.map((h) => (
            <div key={h.label} className="rounded-xl bg-white/5 px-4 py-3">
              <dt className="text-[11.5px] text-white/50">{h.label}</dt>
              <dd className="text-[20px] font-bold text-accent">{h.value}</dd>
            </div>
          ))}
        </dl>
        <span className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-[#16161c] transition group-hover:bg-accent group-hover:text-white">
          Explore the school <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
