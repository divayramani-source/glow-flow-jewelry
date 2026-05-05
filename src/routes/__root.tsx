import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header, Footer } from "@/components/Layout";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-chrome">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the sauce</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn't exist. Let's get you back to the drip.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IcedOut — Premium Hip-Hop Jewelry" },
      {
        name: "description",
        content:
          "Iced-out, hipster hip-hop jewelry for Gen Z. Silver, gold, rose gold. Custom builds, financing, COD.",
      },
      { property: "og:title", content: "IcedOut — Premium Hip-Hop Jewelry" },
      { property: "og:description", content: "Glow & Flow Jewelry is a modern e-commerce platform for personalized jewelry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IcedOut — Premium Hip-Hop Jewelry" },
      { name: "twitter:description", content: "Iced-out, hipster hip-hop jewelry for Gen Z. Silver, gold, rose gold. Custom builds, financing, COD." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8184188a-cebf-499f-a7e5-85be48fd3ae5/id-preview-ddfea267--886048bb-7d00-4fd6-bb39-4d389bc52d30.lovable.app-1777953764401.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8184188a-cebf-499f-a7e5-85be48fd3ae5/id-preview-ddfea267--886048bb-7d00-4fd6-bb39-4d389bc52d30.lovable.app-1777953764401.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="pt-16">
          <Outlet />
        </main>
        <Footer />
        <Toaster theme="dark" position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
