import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatUSD, metalLabel, metalSwatch } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — IcedOut" }] }),
  component: Cart,
});

function Cart() {
  const { items, remove, setQty, total } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 md:px-8 py-24 text-center">
        <h1 className="font-display text-5xl">Your bag's empty.</h1>
        <p className="text-muted-foreground mt-3">Time to add some shine.</p>
        <Link to="/shop" className="mt-6 inline-flex h-12 items-center px-6 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest glow">
          Browse Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 grid lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <h1 className="font-display text-4xl mb-8">Cart</h1>
        <div className="space-y-3">
          {items.map((i) => (
            <div key={`${i.slug}-${i.metal}`} className="flex gap-4 rounded-2xl glass p-3">
              <img src={i.image} alt={i.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-display">{i.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <span className="h-3 w-3 rounded-full border border-white/20" style={{ background: metalSwatch(i.metal) }} />
                      {metalLabel(i.metal)}
                    </div>
                  </div>
                  <div className="text-chrome">{formatUSD(i.price_cents * i.qty)}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex h-9 items-center rounded-full border border-border bg-secondary/30">
                    <button onClick={() => setQty(i.slug, i.metal, i.qty - 1)} className="h-9 w-9">−</button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.slug, i.metal, i.qty + 1)} className="h-9 w-9">+</button>
                  </div>
                  <button onClick={() => remove(i.slug, i.metal)} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-3xl glass p-6 h-fit sticky top-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Summary</div>
        <div className="mt-4 space-y-2 text-sm">
          <Row l="Subtotal" r={formatUSD(total)} />
          <Row l="Shipping" r="Free" />
          <Row l="Tax" r="At checkout" />
        </div>
        <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Total</div>
          <div className="text-2xl text-chrome">{formatUSD(total)}</div>
        </div>
        <Link
          to="/checkout"
          className="mt-6 w-full inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest glow"
        >
          Checkout <ArrowRight className="h-4 w-4" />
        </Link>
      </aside>
    </section>
  );
}

function Row({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{l}</span><span className="text-foreground">{r}</span>
    </div>
  );
}
