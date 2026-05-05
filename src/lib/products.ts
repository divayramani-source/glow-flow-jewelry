import chain from "@/assets/p-chain.jpg";
import pendant from "@/assets/p-pendant.jpg";
import ring from "@/assets/p-ring.jpg";
import earrings from "@/assets/p-earrings.jpg";
import bracelet from "@/assets/p-bracelet.jpg";
import grillz from "@/assets/p-grillz.jpg";

export const productImages: Record<string, string> = {
  "cuban-link": chain,
  "rose-cross": pendant,
  "paved-signet": ring,
  "halo-hoops": earrings,
  "tennis-bracelet": bracelet,
  "rose-grillz": grillz,
};

export const metalLabel = (m: string) =>
  m === "silver" ? "Silver" : m === "gold" ? "Gold" : "Rose Gold";

export const metalSwatch = (m: string) =>
  m === "silver"
    ? "linear-gradient(135deg,#e8e8ee,#9aa0a6)"
    : m === "gold"
      ? "linear-gradient(135deg,#fce29a,#c89b3c)"
      : "linear-gradient(135deg,#f6c8b8,#b76e5b)";

export const formatUSD = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export const resolveImage = (slug: string, fallback: string | null): string =>
  productImages[slug] ?? fallback ?? "";