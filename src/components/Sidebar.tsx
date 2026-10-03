import Link from "next/link";
import { categories, slugify } from "@/lib/site";
import { getCategoryCounts } from "@/lib/posts";
import { GreetingCard } from "./GreetingCard";

export function Sidebar({ active }: { active?: string }) {
  const counts = getCategoryCounts();
  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-[90px] lg:w-[168px] lg:self-start lg:pt-[62px]">
      <GreetingCard />

      <nav aria-label="Categories" className="rounded-xl bg-white px-5 py-7">
        <h2 className="text-[22px] font-bold">Category</h2>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-[12px] lg:flex-col">
          {categories.map((c) => {
            const isActive = active === c;
            return (
              <li key={c}>
                <Link
                  href={`/category/${slugify(c)}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center justify-between gap-2 text-[12.5px] transition ${
                    isActive ? "font-semibold text-accent" : "text-[#7d7f8c] hover:text-accent"
                  }`}
                >
                  <span className="transition-transform group-hover:translate-x-1">{c}</span>
                  {counts[c] ? (
                    <span className="hidden rounded-full bg-background px-1.5 text-[10px] text-muted lg:inline">
                      {counts[c]}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
