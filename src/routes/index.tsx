import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Diamond, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import bgChrome from "@/assets/bg-chrome.jpg";
import { listProducts, type Product } from "~/server/products.functions";
import { formatUSD, metalSwatch, productImages } from "@/lib/products";

export const Route = createFileRoute("/")({
  loader: () => listProducts(),
  component: Home,
});

function Home() {
  const products = Route.useLoaderData() as Product[];
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <Hero />
      <Marquee />
      <Featured items={featured} />
      <Categories />
      <CustomCTA />
      <Drops items={products.slice(0, 6)} />
      <Promises />
      <Reviews />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: x * 14, y: -y * 14 });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-hero">
      <div
        aria-hidden
        className="absolute inset-0 opacity-25 mix-blend-screen"
        style={{ backgroundImage: `url(${bgChrome})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-[var(--rose)]/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-[var(--silver)]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.25em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--rose)] animate-pulse" />
            New Drop · Vol. 07
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
            Drip that <span className="text-chrome">talks.</span>
            <br />
            Worn like <span className="italic text-ice">armor.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg">
            Hand-finished hip-hop jewelry for the next generation. Built in silver, gold and rose
            gold. Customize anything. Pay your way — lump sum, EMI, deposit, or COD.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 text-sm uppercase tracking-widest glow hover:translate-y-[-2px] transition"
            >
              Shop the drop
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/customize"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-secondary/40 px-6 text-sm uppercase tracking-widest hover:bg-secondary transition"
            >
              <Sparkles className="h-4 w-4" /> Build custom
            </Link>
          </div>
          <div className="flex items-center gap-6 pt-4 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><Diamond className="h-3.5 w-3.5" /> VVS Stones</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Lifetime Polish</span>
            <span className="flex items-center gap-2"><Truck className="h-3.5 w-3.5" /> Free US Ship</span>
          </div>
        </div>

        <div
          className="relative aspect-square max-w-xl mx-auto w-full"
          style={{ transform: `perspective(1100px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition: "transform 200ms ease-out" }}
        >
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden ring-rose">
            <img
              src={hero}
              alt="Stacked hip hop jewelry in silver, gold and rose gold"
              className="w-full h-full object-cover"
              width={1920}
              height={1280}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-background/30" />
          </div>
          <div className="absolute -top-6 -left-6 glass rounded-2xl px-4 py-3 float-slow">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Carat Weight</div>
            <div className="text-xl text-chrome font-semibold">12.4 ct</div>
          </div>
          <div className="absolute -bottom-6 -right-6 glass rounded-2xl px-4 py-3 float-slow [animation-delay:1.5s]">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Metals</div>
            <div className="flex gap-2 mt-1">
              {["silver", "gold", "rose-gold"].map((m) => (
                <span key={m} className="h-5 w-5 rounded-full border border-white/20" style={{ background: metalSwatch(m) }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Free US Shipping", "Lifetime Polish", "VVS Diamonds", "Custom Builder", "Financing 0% APR", "COD Available"];
  const row = [...items, ...items, ...items];
  return (
    <div className="border-y border-border/40 py-5 ticker-mask overflow-hidden">
      <div className="marquee whitespace-nowrap flex gap-12 text-sm uppercase tracking-[0.3em] text-muted-foreground">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <Diamond className="h-3 w-3 text-[var(--rose)]" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Featured({ items }: { items: { slug: string; name: string; price_cents: number }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-24">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Hand-picked</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2">The hero pieces.</h2>
        </div>
        <Link to="/shop" className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition">
          See all →
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((p, i) => (
          <Link
            key={p.slug}
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="group card-3d relative overflow-hidden rounded-3xl glass"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img
                src={productImages[p.slug]}
                alt={p.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/0 to-background/0" />
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest glass px-2 py-1 rounded-full">
                #{String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <div className="font-display text-lg">{p.name}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">3 metals · ships 48h</div>
              </div>
              <div className="text-chrome font-display text-lg">{formatUSD(p.price_cents)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const cats = [
    { name: "Chains", slug: "Chains" },
    { name: "Pendants", slug: "Pendants" },
    { name: "Rings", slug: "Rings" },
    { name: "Earrings", slug: "Earrings" },
    { name: "Bracelets", slug: "Bracelets" },
    { name: "Grillz", slug: "Grillz" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {cats.map((c) => (
          <Link
            key={c.slug}
            to="/shop"
            search={{ cat: c.slug }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-secondary/30 hover:bg-secondary/60 transition aspect-[3/2] flex items-end p-4"
          >
            <span className="font-display text-lg">{c.name}</span>
            <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CustomCTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-8 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] glass p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url(${bgChrome})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Made for you</div>
          <h3 className="font-display text-4xl md:text-6xl mt-3 leading-tight">
            Your name. <br /> Your <span className="text-chrome">metal.</span> <br /> Your moment.
          </h3>
          <p className="text-muted-foreground mt-4 max-w-md">
            Drop a name, upload a reference, pick your metal. We handcraft it within 14 days.
          </p>
          <Link
            to="/customize"
            className="inline-flex mt-6 h-12 items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 text-sm uppercase tracking-widest glow"
          >
            Start building <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative grid grid-cols-3 gap-3">
          {["silver", "gold", "rose-gold"].map((m) => (
            <div key={m} className="aspect-square rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: metalSwatch(m) }} />
              <div className="absolute inset-0 shimmer" />
              <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] uppercase tracking-[0.25em] text-black/70 font-semibold">
                {m.replace("-", " ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Drops({ items }: { items: { slug: string; name: string; price_cents: number }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">The Vault</div>
        <h2 className="font-display text-4xl md:text-5xl mt-2">Latest drops.</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((p) => (
          <Link
            key={p.slug}
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="group rounded-2xl overflow-hidden border border-border bg-secondary/30 hover:border-[var(--rose)] transition"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={productImages[p.slug]}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
              />
            </div>
            <div className="p-3">
              <div className="text-sm truncate">{p.name}</div>
              <div className="text-xs text-chrome">{formatUSD(p.price_cents)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Promises() {
  const items = [
    { icon: Truck, t: "Free US Shipping", d: "On every order, no minimum." },
    { icon: ShieldCheck, t: "Lifetime Polish", d: "Bring it back, we re-ice it." },
    { icon: Sparkles, t: "0% Financing", d: "Pay over time, no interest." },
    { icon: Diamond, t: "Authentic Stones", d: "VVS-grade, certified." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl glass p-5">
            <Icon className="h-5 w-5 text-[var(--rose)]" />
            <div className="font-display mt-3">{t}</div>
            <div className="text-xs text-muted-foreground mt-1">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  const r = [
    { n: "Jaylen R.", t: "The cuban link is INSANE. Shines like a movie prop." },
    { n: "Mia D.", t: "Custom name pendant came out perfect. Rose gold hit different." },
    { n: "Tre P.", t: "Financing was painless, piece arrived in 5 days." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Real wearers</div>
        <h2 className="font-display text-4xl md:text-5xl mt-2">Worn loud.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {r.map((x) => (
          <div key={x.n} className="rounded-2xl glass p-6">
            <div className="flex gap-0.5 text-[var(--rose)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm">"{x.t}"</p>
            <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">— {x.n}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
