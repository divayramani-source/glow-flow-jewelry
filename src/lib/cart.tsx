import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price_cents: number;
  metal: string;
  qty: number;
  image: string;
};

type CartCtx = {
  items: CartItem[];
  add: (i: CartItem) => void;
  remove: (slug: string, metal: string) => void;
  setQty: (slug: string, metal: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "iced.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      add: (i) =>
        setItems((prev) => {
          const idx = prev.findIndex((p) => p.slug === i.slug && p.metal === i.metal);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], qty: copy[idx].qty + i.qty };
            return copy;
          }
          return [...prev, i];
        }),
      remove: (slug, metal) =>
        setItems((p) => p.filter((x) => !(x.slug === slug && x.metal === metal))),
      setQty: (slug, metal, qty) =>
        setItems((p) =>
          p.map((x) => (x.slug === slug && x.metal === metal ? { ...x, qty: Math.max(1, qty) } : x))
        ),
      clear: () => setItems([]),
      total: items.reduce((s, i) => s + i.price_cents * i.qty, 0),
      count: items.reduce((s, i) => s + i.qty, 0),
    }),
    [items]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("CartProvider missing");
  return c;
};
