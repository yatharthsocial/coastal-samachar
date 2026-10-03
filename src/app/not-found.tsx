import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[700px] flex-col items-center px-4 py-24 text-center">
      <span className="flex size-16 animate-bounce items-center justify-center rounded-full bg-accent-soft text-accent">
        <Compass className="size-7" />
      </span>
      <p className="mt-6 text-[64px] font-bold leading-none tracking-tight">404</p>
      <h1 className="mt-3 text-[22px] font-semibold">This story drifted out to sea</h1>
      <p className="mt-2 text-[15px] text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-full bg-accent px-6 py-3 text-[13px] font-semibold text-white transition hover:brightness-110">
          Back to home
        </Link>
        <Link href="/search" className="rounded-full bg-white px-6 py-3 text-[13px] font-semibold transition hover:text-accent">
          Search stories
        </Link>
      </div>
    </main>
  );
}
