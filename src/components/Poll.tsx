"use client";

import { Check } from "lucide-react";
import type { PollData } from "@/lib/data";
import { useStored } from "@/lib/store";
import { toast } from "./Toaster";

const EMPTY: Record<string, number> = {};

// Votes are remembered in the reader's browser only (no backend), on top of
// the seed counts in data.ts.
export function Poll({ poll, compact = false }: { poll: PollData; compact?: boolean }) {
  const [votes, setVotes] = useStored<Record<string, number>>("cs-poll-votes", EMPTY);
  const choice = votes[poll.id];
  const voted = choice !== undefined;
  const counts = poll.seed.map((n, i) => n + (choice === i ? 1 : 0));
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div className={`rounded-2xl bg-white ${compact ? "p-6" : "p-7 sm:p-9"}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Quick poll</p>
      <h3 className={`mt-2 font-semibold leading-snug ${compact ? "text-[16px]" : "text-[19px]"}`}>
        {poll.question}
      </h3>
      <ul className="mt-5 space-y-2.5">
        {poll.options.map((opt, i) => {
          const pct = Math.round((counts[i] / total) * 100);
          const mine = choice === i;
          return (
            <li key={opt}>
              <button
                disabled={voted}
                onClick={() => {
                  setVotes((v) => ({ ...v, [poll.id]: i }));
                  toast("Thanks for voting!");
                }}
                className={`relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-4 py-3 text-left text-[13.5px] font-medium transition ${
                  voted
                    ? mine
                      ? "border-accent"
                      : "border-line"
                    : "border-line hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
                }`}
              >
                <span
                  className={`absolute inset-y-0 left-0 transition-[width] duration-700 ease-out ${
                    mine ? "bg-accent-soft" : "bg-background"
                  }`}
                  style={{ width: voted ? `${pct}%` : "0%" }}
                />
                <span className="relative flex items-center gap-2">
                  {mine && <Check className="size-4 text-accent" />}
                  {opt}
                </span>
                {voted && <span className="relative font-semibold">{pct}%</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex items-center justify-between text-[12px] text-muted">
        <span>{total.toLocaleString("en-IN")} votes</span>
        {voted && (
          <button
            onClick={() =>
              setVotes((v) => {
                const next = { ...v };
                delete next[poll.id];
                return next;
              })
            }
            className="font-semibold text-accent hover:underline"
          >
            Change vote
          </button>
        )}
      </div>
    </div>
  );
}
