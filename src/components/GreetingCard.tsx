"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Waves } from "lucide-react";
import { useBookmarks } from "@/lib/store";

function greeting(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function GreetingCard() {
  const { list } = useBookmarks();
  const [now, setNow] = useState<Date | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setNow(new Date()), []);

  return (
    <Link
      href="/saved"
      className="group relative block rounded-xl bg-white px-5 pb-5 pt-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
    >
      <span className="flex size-[38px] items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#ff9a6b] text-white">
        <Waves className="size-5" />
      </span>
      <p className="mt-3 text-[13px] font-semibold">
        {now ? greeting(now.getHours()) : "Welcome"}, reader
      </p>
      <p className="mt-0.5 text-[11.5px] text-muted">
        {list.length
          ? `${list.length} saved ${list.length === 1 ? "story" : "stories"}`
          : now?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) ?? " "}
      </p>
      <span className="absolute right-5 top-[30px] size-2 rounded-full bg-pocket ring-4 ring-pocket/15" />
    </Link>
  );
}
