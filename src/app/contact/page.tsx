import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name} for story tips, partnerships and advertising.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-12 lg:px-12">
      <PageHeader
        eyebrow="Contact"
        title="Say hello"
        description="Story tips, partnerships, guest posts or feedback — we read every message."
      />
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <ContactForm />
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-7">
            <Mail className="size-5 text-accent" />
            <p className="mt-3 text-[13px] text-muted">Email</p>
            <a href={`mailto:${site.email}`} className="text-[15px] font-semibold hover:text-accent">
              {site.email}
            </a>
          </div>
          <div className="rounded-2xl bg-white p-7">
            <MapPin className="size-5 text-accent" />
            <p className="mt-3 text-[13px] text-muted">Based in</p>
            <p className="text-[15px] font-semibold">Coastal Karnataka, India</p>
          </div>
        </div>
      </div>
    </main>
  );
}
