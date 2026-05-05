import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — IcedOut" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) nav({ to: "/account" });
  }, [user, nav]);

  const submit = async () => {
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        nav({ to: "/account" });
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 md:px-8 py-24">
      <div className="rounded-3xl glass p-8">
        <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Join the family"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signin" ? "Sign in to your account." : "Create your IcedOut account."}
        </p>

        <div className="mt-6 space-y-3">
          {mode === "signup" && (
            <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-xl bg-input/60 border border-border px-4 outline-none focus:border-[var(--rose)]" />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl bg-input/60 border border-border px-4 outline-none focus:border-[var(--rose)]" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-xl bg-input/60 border border-border px-4 outline-none focus:border-[var(--rose)]" />
          <button onClick={submit} disabled={busy}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest glow disabled:opacity-60">
            {busy ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-6 text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}
