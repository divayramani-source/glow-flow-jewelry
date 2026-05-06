import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Configured for Vercel deployment.
// - Disables Cloudflare plugin
// - Sets TanStack Start target to "vercel" so the build emits a Vercel-compatible output
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    target: "vercel",
  },
});
