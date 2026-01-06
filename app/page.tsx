import { createSupabaseServer } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import type { Metadata } from "next";

// SEO Optimization
export const metadata: Metadata = {
  title: "FYTRR RUN 2026 | Beyond Limits",
  description:
    "Official race platform for FYTRR RUN 2026 Dumka. Experience the ultimate Hyrox-inspired challenge. Claim your BIB and join the pace.",
  openGraph: {
    title: "FYTRR RUN 2026 | Dumka",
    description: "Beyond Limits. The ultimate marathon and fitness challenge.",
    images: ["/og-image.jpg"], // Ensure you have this in public folder
  },
};

export default async function LandingPage() {
  // 1. Initialize server client (SEO-friendly: content is rendered on server)
  const supabase = await createSupabaseServer();

  // 2. Fetch active events
  const { data: activeEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("event_date", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen bg-brand-secondary">
      {/* SECTION 1: HERO (Mobile-First & High Impact) */}
      <section className="relative min-h-[90vh] md:h-[95vh] flex items-center justify-center bg-brand-primary overflow-hidden px-6">
        {/* Radical Glow for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-transparent to-transparent opacity-60" />

        <div className="z-10 text-center space-y-8 max-w-5xl">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black italic tracking-tighter text-brand-secondary uppercase leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Beyond <br /> <span className="text-brand-accent/30">Limits</span>
            </h1>
            <p className="text-brand-accent uppercase font-black tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-sm">
              Dumka, Jharkhand | Official Race Platform • 2026
            </p>
          </div>

          <div className="pt-8">
            <Link
              href="#active-races"
              className="bg-brand-secondary text-brand-primary px-8 md:px-12 py-4 md:py-5 rounded-race font-black uppercase tracking-widest hover:bg-brand-success hover:text-brand-primary transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)] inline-block text-xs md:text-sm"
            >
              Explore Races
            </Link>
          </div>
        </div>

        {/* Background Grid - Visible on desktop, subtle on mobile */}
        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </section>

      {/* SECTION 2: ACTIVE RACES (SEO-Friendly Dynamic Grid) */}
      <section
        id="active-races"
        className="relative max-w-7xl mx-auto py-24 md:py-32 px-6 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-brand-primary">
              Active <span className="text-brand-accent/40">Races</span>
            </h2>
            <div className="h-1.5 w-24 bg-brand-primary rounded-full" />
            <p className="text-brand-accent uppercase font-black tracking-widest text-[10px] md:text-xs">
              Pick your challenge and claim your official BIB
            </p>
          </div>
          <Link
            href="/past-events"
            className="text-[11px] font-black uppercase border-b-2 border-brand-accent/20 pb-1 hover:text-brand-primary hover:border-brand-primary transition-all italic"
          >
            View Event History
          </Link>
        </div>

        {/* Dynamic Grid: 1 on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {activeEvents && activeEvents.length > 0 ? (
            activeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center border-4 border-dashed border-brand-accent/10 rounded-race bg-zinc-50/50">
              <p className="text-brand-accent font-black uppercase italic tracking-widest text-sm">
                No active races at the moment. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: FEATURES (Value Proposition) */}
      <section className="bg-zinc-50 py-24 md:py-32 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {[
            {
              title: "Fast BIBs",
              desc: "Instant assignment via Razorpay. No waiting, no manual errors.",
              color: "brand-primary",
            },
            {
              title: "Live Timing",
              desc: "Precision timing. Results published within minutes of finishing.",
              color: "brand-accent",
            },
            {
              title: "Verified",
              desc: "Official podium results and digital medals available immediately.",
              color: "brand-primary",
            },
          ].map((f, i) => (
            <div key={i} className="space-y-4 text-center md:text-left group">
              <div className="h-1.5 w-12 bg-brand-primary rounded-full mx-auto md:mx-0 group-hover:w-20 transition-all duration-500" />
              <h3 className="font-black italic text-2xl uppercase tracking-tighter text-brand-primary">
                {f.title}
              </h3>
              <p className="text-sm text-brand-accent font-bold leading-relaxed uppercase">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
