import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Poll } from "@/components/Poll";
import { Reveal } from "@/components/Reveal";
import { polls } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reader Polls",
  description: "Have your say. Vote in quick polls about life on the coast.",
  alternates: { canonical: "/polls" },
};

export default function PollsPage() {
  return (
    <main className="mx-auto w-full max-w-[1390px] px-4 pb-10 pt-12 lg:px-12">
      <PageHeader
        eyebrow="Have your say"
        title="Reader polls"
        description="Tap an option to vote and see how other readers answered. You can change your vote anytime."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {polls.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <Poll poll={p} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
