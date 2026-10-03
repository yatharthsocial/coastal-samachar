"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Toast = { id: number; message: string };

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("cs-toast", { detail: message }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message: (e as CustomEvent<string>).detail }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
    };
    window.addEventListener("cs-toast", onToast);
    return () => window.removeEventListener("cs-toast", onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex animate-toast items-center gap-2.5 rounded-full bg-[#1a1a1f] px-5 py-3 text-sm font-medium text-white shadow-xl shadow-black/20"
        >
          <CheckCircle2 className="size-4 text-pocket" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
