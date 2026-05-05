import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, CalendarClock, Coins, Truck, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { formatUSD } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — IcedOut" }] }),
  component: Checkout,
});

type Method = "lump_sum" | "part_payment" | "financing" | "cod";

const methods: { id: Method; t: string; d: string; icon: typeof Banknote }[] = [
  { id: "lump_sum", t: "Pay in full", d: "One-time card payment via Stripe.", icon: Banknote },
  { id: "part_payment", t: "Part payment", d: "30% deposit now, balance on ship.", icon: Coins },
  { id: "financing", t: "Financing / EMI", d: "Affirm or Klarna at checkout, 0% APR available.", icon: CalendarClock },
  { id: "cod", t: "Cash on delivery", d: "Pay when it arrives. US only, $1k cap.", icon: Truck },
];

const Ship = z.object({
  name: z.string().trim().min(1).max(80),
  address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(1).max(80),
  zip: z.string().trim().min(3).max(20),
});

function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [method, setMethod] = useState<Method>("lump_sum");
  const [form, setForm] = useState({ name: "", address: "", city: "", zip: "" });
  const [busy, setBusy] = useState(false);

  if (items.length === 0) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <Link to="/shop" className="text-sm uppercase tracking-widest text-muted-foreground">Cart empty — back to shop</Link>
      </section>
    );
  }

  const placeOrder = async () => {
    if (!user) {
      toast.error("Sign in to place your order");
      nav({ to: "/auth" });
      return;
    }
    const parsed = Ship.safeParse(form);
    if (!parsed.success) {
      toast.error("Please complete shipping info");
      return;
    }
    setBusy(true);
    try {
      const payment_status =
        method === "cod" ? "cod_pending" : method === "part_payment" ? "partial" : "unpaid";
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        total_cents: total,
        payment_method: method,
        payment_status,
        status: method === "cod" ? "confirmed" : "awaiting_payment",
        shipping_name: form.name,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_zip: form.zip,
        items: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          metal: i.metal,
          qty: i.qty,
          price_cents: i.price_cents,
        })),
      });
      if (error) throw error;
      clear();
      toast.success("Order placed! We'll be in touch with payment details.");
      nav({ to: "/account" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const dueNow =
    method === "lump_sum" || method === "financing"
      ? total
      : method === "part_payment"
        ? Math.round(total * 0.3)
        : 0;

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 grid lg:grid-cols-[1fr_400px] gap-10">
      <div className="space-y-10">
        <div>
          <h1 className="font-display text-4xl">Checkout</h1>
          <p className="text-sm text-muted-foreground mt-2">Pick how you want to pay. All Stripe-secured.</p>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">1 · Shipping</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input ph="Full name" v={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input ph="ZIP" v={form.zip} onChange={(v) => setForm({ ...form, zip: v })} />
            <Input ph="Street address" v={form.address} onChange={(v) => setForm({ ...form, address: v })} className="sm:col-span-2" />
            <Input ph="City" v={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">2 · Payment method</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {methods.map((m) => {
              const active = method === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`text-left rounded-2xl p-4 border transition ${active ? "border-[var(--rose)] glow bg-secondary/40" : "border-border bg-secondary/20 hover:bg-secondary/40"}`}
                >
                  <div className="flex items-start justify-between">
                    <Icon className="h-5 w-5 text-[var(--rose)]" />
                    {active && <Check className="h-4 w-4 text-[var(--rose)]" />}
                  </div>
                  <div className="font-display mt-3">{m.t}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.d}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="rounded-3xl glass p-6 h-fit sticky top-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Order</div>
        <div className="mt-4 space-y-2 text-sm">
          {items.map((i) => (
            <div key={`${i.slug}-${i.metal}`} className="flex justify-between text-muted-foreground">
              <span className="truncate">{i.qty}× {i.name}</span>
              <span className="text-foreground">{formatUSD(i.price_cents * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span>{formatUSD(total)}</span></div>
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Due now</span>
            <span className="text-chrome text-xl">{formatUSD(dueNow)}</span>
          </div>
        </div>
        <button
          onClick={placeOrder}
          disabled={busy}
          className="mt-6 w-full h-12 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest glow disabled:opacity-60"
        >
          {busy ? "Placing…" : method === "cod" ? "Place COD order" : "Continue to payment"}
        </button>
        <p className="text-[10px] text-muted-foreground mt-3 text-center uppercase tracking-widest">
          Stripe secured · 256-bit SSL
        </p>
      </aside>
    </section>
  );
}

function Input({ ph, v, onChange, className = "" }: { ph: string; v: string; onChange: (v: string) => void; className?: string }) {
  return (
    <input
      placeholder={ph}
      value={v}
      onChange={(e) => onChange(e.target.value)}
      className={`h-12 rounded-xl bg-input/60 border border-border px-4 outline-none focus:border-[var(--rose)] ${className}`}
    />
  );
}
