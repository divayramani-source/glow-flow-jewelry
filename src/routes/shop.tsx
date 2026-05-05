import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { listProducts, type Product } from "@/server/products.functions";
import { formatUSD, productImages, metalSwatch } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({ cat: typeof s.cat === "string" ? s.cat : undefined }),
  loader: () => listProducts(),
  head: () => ({ meta: [{ title: "Shop — IcedOut" }, { name: "description", content: "Browse premium hip-hop jewelry." }] }),
  component: Shop,
});

function Shop() {
  const products = Route.useLoaderData() as Product[];
  const { cat } = Route.useSearch();
  const [active, setActive] = useState<string | undefined>(cat);
  const cats = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const filtered = active ? products.filter((p) => p.category === active) : products;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex flex-col gap-2 mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">The Vault</div>
        <h1 className="font-display text-5xl md:text-6xl">Shop everything.</h1>
        <p className="text-muted-foreground max-w-xl">Every piece is hand-finished. Pick a metal at checkout.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActive(undefined)}
          className={`h-9 px-4 rounded-full text-xs uppercase tracking-widest border ${!active ? "bg-primary text-primary-foreground border-transparent" : "border-border bg-secondary/40"}`}
        >
          All
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`h-9 px-4 rounded-full text-xs uppercase tracking-widest border ${active === c ? "bg-primary text-primary-foreground border-transparent" : "border-border bg-secondary/40"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <Link
            key={p.id}
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="group card-3d rounded-3xl overflow-hidden glass"
          >
            <div className="aspect-square overflow-hidden">
              <img src={productImages[p.slug]} alt={p.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-display">{p.name}</div>
                <div className="text-chrome">{formatUSD(p.price_cents)}</div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {p.metals.map((m) => (
                  <span key={m} className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ background: metalSwatch(m) }} />
                ))}
                <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
