import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatUSD } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — IcedOut" }] }),
  component: Admin,
});

type Order = {
  id: string;
  user_id: string;
  total_cents: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  tracking_number: string | null;
  fulfillment_notes: string | null;
  notes: string | null;
  items: Array<{ name: string; qty: number; metal: string; price_cents?: number }>;
};

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["unpaid", "partial", "paid", "refunded", "cod_pending", "cod_collected"];

function Admin() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "cod" | "unpaid" | "pending">("all");

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(Boolean(data));
    });
  }, [user]);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setOrders((data ?? []) as unknown as Order[]);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const update = async (id: string, patch: Partial<Order>) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  if (loading || isAdmin === null) {
    return <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 text-sm text-muted-foreground">Loading…</section>;
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-4 md:px-8 py-24 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Restricted</div>
        <h1 className="font-display text-4xl mt-2">Admins only</h1>
        <p className="text-sm text-muted-foreground mt-4">
          Your account ({user?.email}) doesn't have admin access. Ask an existing admin to grant you the role,
          or insert your user_id into the user_roles table with role 'admin'.
        </p>
        <div className="mt-6 text-xs text-muted-foreground break-all">Your user id: {user?.id}</div>
      </section>
    );
  }

  const filtered = orders.filter((o) => {
    if (filter === "cod") return o.payment_method === "cod";
    if (filter === "unpaid") return o.payment_status === "unpaid" || o.payment_status === "cod_pending";
    if (filter === "pending") return o.status === "pending";
    return true;
  });

  const stats = {
    total: orders.length,
    revenue: orders.filter((o) => o.payment_status === "paid" || o.payment_status === "cod_collected").reduce((s, o) => s + o.total_cents, 0),
    cod: orders.filter((o) => o.payment_method === "cod").length,
    pending: orders.filter((o) => o.status === "pending").length,
  };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Admin</div>
        <h1 className="font-display text-4xl mt-2">Orders Console</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Orders" value={stats.total.toString()} />
        <Stat label="Revenue" value={formatUSD(stats.revenue)} />
        <Stat label="COD orders" value={stats.cod.toString()} />
        <Stat label="Pending" value={stats.pending.toString()} />
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "unpaid", "cod"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-9 px-4 rounded-full text-xs uppercase tracking-widest border ${
              filter === f ? "bg-foreground text-background border-foreground" : "border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl glass p-8 text-center text-sm text-muted-foreground">No orders match.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl glass p-5">
              <div className="flex justify-between gap-4 flex-wrap mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">
                    #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString()}
                  </div>
                  <div className="font-display text-lg mt-1">{o.shipping_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.shipping_address}, {o.shipping_city} {o.shipping_zip}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-chrome text-2xl">{formatUSD(o.total_cents)}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {o.payment_method.replace("_", " ")}
                  </div>
                </div>
              </div>

              <div className="text-xs mb-4 space-y-1">
                {o.items.map((i, idx) => (
                  <div key={idx} className="text-muted-foreground">
                    {i.qty}× {i.name} <span className="text-[var(--rose)]">({i.metal})</span>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <Field label="Order status">
                  <select
                    value={o.status}
                    onChange={(e) => update(o.id, { status: e.target.value })}
                    className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm"
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Payment status">
                  <select
                    value={o.payment_status}
                    onChange={(e) => update(o.id, { payment_status: e.target.value })}
                    className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm"
                  >
                    {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <Field label="Tracking #">
                  <input
                    defaultValue={o.tracking_number ?? ""}
                    onBlur={(e) => e.target.value !== (o.tracking_number ?? "") && update(o.id, { tracking_number: e.target.value })}
                    className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm"
                    placeholder="USPS / FedEx tracking"
                  />
                </Field>
                <Field label="Fulfillment notes (COD pickup, courier, etc.)">
                  <input
                    defaultValue={o.fulfillment_notes ?? ""}
                    onBlur={(e) => e.target.value !== (o.fulfillment_notes ?? "") && update(o.id, { fulfillment_notes: e.target.value })}
                    className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm"
                    placeholder={o.payment_method === "cod" ? "COD courier / cash collected by…" : "Internal notes"}
                  />
                </Field>
              </div>

              {o.notes && (
                <div className="text-xs text-muted-foreground mb-3">
                  <span className="uppercase tracking-widest">Customer note:</span> {o.notes}
                </div>
              )}

              <div className="flex justify-end">
                <button onClick={() => remove(o.id)} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive">
                  Delete order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl glass p-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl mt-1 text-chrome">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}
