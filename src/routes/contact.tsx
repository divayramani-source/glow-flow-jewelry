import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Instagram, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — IcedOut" }] }),
  component: Contact,
});

function Contact() {
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success("Message sent. We reply within 24h.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };
  return (
    <section className="mx-auto max-w-5xl px-4 md:px-8 py-20 grid md:grid-cols-2 gap-10">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Get in touch</div>
        <h1 className="font-display text-5xl mt-3">Talk to us.</h1>
        <p className="text-muted-foreground mt-4 max-w-md">Questions, custom quotes, press — drop a line.</p>

        <ul className="mt-10 space-y-4 text-sm">
          <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--rose)]" /> hello@icedout.shop</li>
          <li className="flex items-center gap-3"><Instagram className="h-4 w-4 text-[var(--rose)]" /> @icedoutshop</li>
          <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-[var(--rose)]" /> Live chat 9am–7pm EST</li>
        </ul>
      </div>
      <form onSubmit={submit} className="rounded-3xl glass p-6 space-y-3">
        <input required placeholder="Your name" className="w-full h-12 rounded-xl bg-input/60 border border-border px-4 outline-none focus:border-[var(--rose)]" />
        <input required type="email" placeholder="Email" className="w-full h-12 rounded-xl bg-input/60 border border-border px-4 outline-none focus:border-[var(--rose)]" />
        <textarea required rows={5} placeholder="Your message" className="w-full rounded-xl bg-input/60 border border-border p-3 outline-none focus:border-[var(--rose)]" />
        <button disabled={busy} className="w-full h-12 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest glow">
          {busy ? "Sending…" : "Send Message"}
        </button>
      </form>
    </section>
  );
}
