"use client";

import { Send } from "lucide-react";
import { site } from "@/lib/site";
import { toast } from "./Toaster";

// No backend: the form opens the visitor's email app with everything filled in.
export function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const body = `${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          `[${f.get("topic")}] Message from ${f.get("name")}`,
        )}&body=${encodeURIComponent(body)}`;
        toast("Opening your email app…");
      }}
      className="grid gap-4 rounded-2xl bg-white p-7 sm:grid-cols-2 sm:p-9"
    >
      <Field label="Your name" name="name" />
      <Field label="Email" name="email" type="email" />
      <label className="sm:col-span-2">
        <span className="text-[13px] font-medium">Topic</span>
        <select name="topic" className={inputCls}>
          <option>Story tip</option>
          <option>Guest post / partnership</option>
          <option>Advertising</option>
          <option>Feedback</option>
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="text-[13px] font-medium">Message</span>
        <textarea name="message" required rows={6} className={`${inputCls} h-auto resize-y py-3`} />
      </label>
      <button className="flex h-12 w-fit items-center gap-2 rounded-full bg-accent px-7 text-[14px] font-semibold text-white shadow-lg shadow-accent/25 transition hover:-translate-y-0.5 active:scale-95">
        Send message <Send className="size-4" />
      </button>
    </form>
  );
}

const inputCls =
  "mt-1.5 block h-12 w-full rounded-xl border border-line bg-background px-4 text-[14px] outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10";

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label>
      <span className="text-[13px] font-medium">{label}</span>
      <input name={name} type={type} required className={inputCls} />
    </label>
  );
}
