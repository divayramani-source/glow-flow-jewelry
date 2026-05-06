
## Problem

Your Vercel deployment shows `404: NOT_FOUND` on every route. The build succeeded but Vercel is not serving the app. Two things are wrong:

1. **`vercel.json` is misconfigured.** It sets `"framework": null` and runs `vite build`, which makes Vercel look for a static `dist/` folder. But TanStack Start with `target: "vercel"` emits the **Vercel Build Output API v3** format into `.vercel/output/`. Vercel doesn't know to serve from there with the current config, so every request returns 404 from Vercel's edge (the screenshot's `iad1::bmhcf-...` ID is Vercel's own 404, not your app's).

2. **Env vars likely missing on Vercel.** Even once routing is fixed, the SSR worker will crash without `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## Fix

### 1. Replace `vercel.json` with a minimal config

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "vite build",
  "installCommand": "npm install",
  "outputDirectory": ".vercel/output"
}
```

Removing `"framework": null` and pointing `outputDirectory` at `.vercel/output` lets Vercel detect the Build Output API v3 artifacts emitted by the TanStack Start Vercel target. Routing (SSR + static) then works automatically.

### 2. Update `.vercelignore` so the build output is not ignored

Currently `.vercelignore` includes `dist`, which is fine, but ensure `.vercel` is **not** ignored (it isn't right now — just confirming).

### 3. Add env vars in the Vercel dashboard

In Vercel → Project → Settings → Environment Variables, add (for Production + Preview):

- `VITE_SUPABASE_URL` = `https://woqgjeayiyudbrwyqlfs.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = (your publishable key)
- `VITE_SUPABASE_PROJECT_ID` = `woqgjeayiyudbrwyqlfs`
- `SUPABASE_URL` = same as above
- `SUPABASE_PUBLISHABLE_KEY` = same publishable key
- `SUPABASE_SERVICE_ROLE_KEY` = (from Lovable Cloud backend settings)

Then redeploy.

### Note

I'll only edit `vercel.json` in code — the env vars must be set by you in the Vercel dashboard since I can't access your Vercel account. After updating both, trigger a fresh deploy and the app will load.
