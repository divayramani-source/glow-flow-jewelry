import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { metalLabel, metalSwatch } from "@/lib/products";

export const Route = createFileRoute("/customize")({
  head: () => ({ meta: [{ title: "Customize — IcedOut" }, { name: "description", content: "Build your custom piece: name, metal, image." }] }),
  component: Customize,
});

const Schema = z.object({
  custom_name: z.string().trim().min(1, "Name required").max(40),
  metal: z.enum(["silver", "gold", "rose-gold"]),
  notes: z.string().trim().max(500).optional(),
});

function Customize() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [metal, setMetal] = useState("rose-gold");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) {
      toast.error("Please sign in to submit a custom order.");
      nav({ to: "/auth" });
      return;
    }
    const parsed = Schema.safeParse({ custom_name: name, metal, notes });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      let ref: string | null = null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error("Image too large (max 5MB)");
        const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("custom-refs").upload(path, file);
        if (upErr) throw upErr;
        ref = path;
      }
      const { error } = await supabase.from("custom_orders").insert({
        user_id: user.id,
        custom_name: parsed.data.custom_name,
        metal: parsed.data.metal,
        notes: parsed.data.notes ?? null,
        reference_image_url: ref,
      });
      if (error) throw error;
      toast.success("Custom request submitted! We'll reach out within 24h.");
      setName(""); setNotes(""); setFile(null);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Made for you</div>
          <h1 className="font-display text-5xl md:text-6xl mt-2 leading-[1]">Build your <span className="text-chrome">grail.</span></h1>
          <p className="text-muted-foreground mt-4 max-w-md">
            Name it, pick the metal, drop a reference image. We'll quote and craft it within 14
            days. Sign in to submit.
          </p>

          <div className="mt-10 rounded-3xl glass p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: metalSwatch(metal) }} />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Preview</div>
              <div className="mt-4 aspect-[3/2] rounded-2xl border border-white/10 flex items-center justify-center bg-background/40">
                <span className="font-display text-4xl md:text-5xl text-chrome tracking-wider">
                  {name || "YOUR NAME"}
                </span>
              </div>
              <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-center text-muted-foreground">
                {metalLabel(metal)} · custom
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl glass p-6 md:p-8 space-y-6">
          <Field label="Name / Word">
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder="ZOE"
              className="w-full h-12 rounded-xl bg-input/60 border border-border px-4 outline-none focus:border-[var(--rose)] uppercase tracking-widest"
            />
          </Field>

          <Field label="Metal">
            <div className="flex gap-3">
              {(["silver", "gold", "rose-gold"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetal(m)}
                  className={`flex-1 rounded-xl p-1 ${metal === m ? "ring-rose" : "border border-border"}`}
                >
                  <span className="block h-10 rounded-lg" style={{ background: metalSwatch(m) }} />
                  <span className="block text-[10px] uppercase tracking-widest mt-1.5 text-center">{metalLabel(m)}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Reference image (optional)">
            <label className="flex items-center gap-3 h-12 rounded-xl border border-dashed border-border px-4 cursor-pointer hover:border-[var(--rose)] transition">
              <Upload className="h-4 w-4" />
              <span className="text-sm text-muted-foreground truncate">
                {file ? file.name : "PNG / JPG up to 5MB"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </Field>

          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              rows={4}
              placeholder="Stones, size, vibe…"
              className="w-full rounded-xl bg-input/60 border border-border p-3 outline-none focus:border-[var(--rose)]"
            />
          </Field>

          <button
            onClick={submit}
            disabled={busy}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground glow text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" /> {busy ? "Submitting…" : "Submit Custom Request"}
          </button>
          {!user && (
            <p className="text-xs text-muted-foreground text-center">
              You'll need to <Link to="/auth" className="text-[var(--rose)] underline">sign in</Link> to submit.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
      {children}
    </div>
  );
}
