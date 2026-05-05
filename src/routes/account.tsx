import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatUSD } from "@/lib/products";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — IcedOut" }] }),
  component: Account,
});

type Order = {
  id: string;
  total_cents: number;
  payment_method: string;
  status: string;
  created_at: string;
  items: Array<{ name: string; qty: number; metal: string }>;
};

function Account() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as unknown as Order[]));
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/" });
  };

  if (!user) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Account</div>
          <h1 className="font-display text-4xl mt-2">{user.email}</h1>
        </div>
        <button onClick={signOut} className="h-10 px-5 rounded-full border border-border text-xs uppercase tracking-widest">
          Sign out
        </button>
      </div>

      <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl glass p-8 text-center text-sm text-muted-foreground">
          No orders yet. <Link to="/shop" className="text-[var(--rose)] underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl glass p-5 flex justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs text-muted-foreground">#{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}</div>
                <div className="font-display mt-1">
                  {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {o.payment_method.replace("_", " ")} · {o.status}
                </div>
              </div>
              <div className="text-chrome text-xl">{formatUSD(o.total_cents)}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
