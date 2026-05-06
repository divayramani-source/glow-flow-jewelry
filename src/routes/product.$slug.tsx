import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { getProduct, type Product } from "@/lib/products.functions";
import { formatUSD, metalLabel, metalSwatch, productImages } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const p = await getProduct({ data: { slug: params.slug } });
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${(loaderData as Product | undefined)?.name ?? "Product"} — IcedOut` },
      { name: "description", content: (loaderData as Product | undefined)?.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex items-center justify-center">Piece not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">{error.message}</div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData() as Product;
  const cart = useCart();
  const nav = useNavigate();
  const [metal, setMetal] = useState<string>(p.metals[0]);
  const [qty, setQty] = useState(1);

  const add = (go?: boolean) => {
    cart.add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      price_cents: p.price_cents,
      metal,
      qty,
      image: productImages[p.slug] ?? "",
    });
    toast.success(`${p.name} added in ${metalLabel(metal)}`);
    if (go) nav({ to: "/cart" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
        <Link to="/shop">Shop</Link> / {p.category}
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="rounded-3xl overflow-hidden glass relative">
          <div className="aspect-square">
            <img src={productImages[p.slug]} alt={p.name} className="h-full w-full object-cover" />
          </div>
          <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">
            VVS · 925 silver core
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">{p.category}</div>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{p.name}</h1>
          <div className="text-2xl text-chrome mt-3">{formatUSD(p.price_cents)}</div>
          <p className="mt-5 text-muted-foreground max-w-md">{p.description}</p>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Metal</div>
            <div className="flex gap-3">
              {p.metals.map((m) => (
                <button
                  key={m}
                  onClick={() => setMetal(m)}
                  className={`group rounded-2xl p-1 ${metal === m ? "ring-rose" : "border border-border"}`}
                >
                  <span className="block h-12 w-16 rounded-xl" style={{ background: metalSwatch(m) }} />
                  <span className="block text-[10px] uppercase tracking-widest mt-1.5 text-center">
                    {metalLabel(m)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="inline-flex h-12 items-center rounded-full border border-border bg-secondary/30 overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-10">−</button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-12 w-10">+</button>
            </div>
            <button
              onClick={() => add(false)}
              className="h-12 px-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary hover:bg-accent hover:text-accent-foreground transition text-xs uppercase tracking-widest"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <button
              onClick={() => add(true)}
              className="h-12 px-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground glow text-xs uppercase tracking-widest"
            >
              <Sparkles className="h-4 w-4" /> Buy now
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 text-xs">
            <div className="glass rounded-xl p-3"><Truck className="h-4 w-4 text-[var(--rose)]" /><div className="mt-2">Free US shipping</div></div>
            <div className="glass rounded-xl p-3"><ShieldCheck className="h-4 w-4 text-[var(--rose)]" /><div className="mt-2">Lifetime polish</div></div>
            <div className="glass rounded-xl p-3"><Sparkles className="h-4 w-4 text-[var(--rose)]" /><div className="mt-2">0% APR financing</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
