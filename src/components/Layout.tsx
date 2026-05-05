import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, User, Sparkles, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/customize", label: "Customize" },
  { to: "/about", label: "Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    return router.subscribe("onResolved", () => setOpen(false));
  }, [router]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "glass border-b border-border/40" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-block w-7 h-7 rounded-full ring-rose">
            <span className="absolute inset-0 rounded-full bg-[var(--gradient-chrome)] animate-spin-slow" />
          </span>
          <span className="font-display text-lg tracking-[0.18em] uppercase">
            Iced<span className="text-chrome">Out</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              <span className="uppercase tracking-widest">{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={user ? "/account" : "/auth"}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex h-9 items-center gap-2 rounded-full px-3 bg-secondary hover:bg-accent hover:text-accent-foreground transition"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs font-medium">{count}</span>
          </Link>
          <Link
            to="/customize"
            className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition glow"
          >
            <Sparkles className="h-3.5 w-3.5" /> Custom
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full bg-secondary"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border/40">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm uppercase tracking-widest py-2">
                {l.label}
              </Link>
            ))}
            <Link to={user ? "/account" : "/auth"} className="text-sm uppercase tracking-widest py-2">
              {user ? "Account" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display tracking-[0.2em] uppercase text-lg">
            Iced<span className="text-chrome">Out</span>
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Premium hip-hop jewelry, made loud. Silver, gold, rose gold — flex your way.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop">All Pieces</Link></li>
            <li><Link to="/customize">Custom Builder</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Brand</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Drops</div>
          <p className="text-sm text-muted-foreground">
            Stay first. New drops monthly. Lifetime polish, free US shipping.
          </p>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground py-6 border-t border-border/40">
        © {new Date().getFullYear()} IcedOut. All rights reserved.
      </div>
    </footer>
  );
}
