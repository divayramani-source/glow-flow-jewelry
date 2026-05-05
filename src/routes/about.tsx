import { createFileRoute } from "@tanstack/react-router";
import bgChrome from "@/assets/bg-chrome.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Story — IcedOut" }, { name: "description", content: "Born loud. Built premium." }] }),
  component: About,
});

function About() {
  return (
    <section className="relative">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${bgChrome})`, backgroundSize: "cover" }} />
      <div className="relative mx-auto max-w-4xl px-4 md:px-8 py-24">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--rose)]">Our Story</div>
        <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[1]">Born loud. <br /> Built <span className="text-chrome">premium.</span></h1>
        <div className="mt-10 space-y-6 text-lg text-muted-foreground">
          <p>IcedOut started in a Brooklyn basement with one welder, two cousins and a dream of making hip-hop jewelry that didn't tarnish in a week.</p>
          <p>Every piece is hand-finished in our NYC studio using 925 silver cores, hand-set VVS stones, and a triple PVD coat in your choice of silver, gold or rose gold.</p>
          <p>We believe drip is self-expression. So we let you build it your way, pay your way, and wear it loud — for life.</p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { n: "10K+", l: "Pieces shipped" },
            { n: "50 states", l: "Free shipping" },
            { n: "14 days", l: "Custom turnaround" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl glass p-6 text-center">
              <div className="font-display text-4xl text-chrome">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
