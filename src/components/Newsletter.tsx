"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/lib/site";
import { toast } from "./Toaster";

// No backend: subscribing opens the reader's email app with a pre-filled
// request. Swap this for a newsletter provider's form action later.
export function Newsletter({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          "Subscribe me to Coastal Samachar",
        )}&body=${encodeURIComponent(`Please add ${email} to the newsletter.`)}`;
        toast("Thanks! Finish subscribing in your email app");
        setEmail("");
      }}
      className={`flex h-12 w-full max-w-md items-center rounded-full p-1 pl-5 ring-accent/40 transition focus-within:ring-2 ${
        dark ? "bg-white/10" : "bg-white"
      }`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className={`min-w-0 flex-1 bg-transparent text-[14px] outline-none ${
          dark ? "text-white placeholder:text-white/50" : "placeholder:text-muted"
        }`}
      />
      <button className="flex h-full items-center gap-2 rounded-full bg-accent px-5 text-[13px] font-semibold text-white transition hover:brightness-110 active:scale-95">
        Subscribe <Send className="size-3.5" />
      </button>
    </form>
  );
}
