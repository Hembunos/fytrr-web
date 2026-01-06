import { createSupabaseServer } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default async function LandingPage() {
  // 1. Initialize server client with cookie handling
  const supabase = await createSupabaseServer();

  // 2. Fetch active events with explicit selection
  const { data: activeEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("event_date", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO (High Impact / SEO) */}
      <section className="relative h-[90vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
            Beyond <span className="text-zinc-500">Limits</span>
          </h1>
          <p className="mt-4 text-zinc-400 uppercase tracking-[0.5em] text-sm md:text-base">
            Dumka, Jharkhand | Feb 15, 2026
          </p>
          <div className="mt-8">
            <Link
              href="#active-races"
              className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
            >
              Explore Races
            </Link>
          </div>
        </div>

        {/* Athletic Background Grid Overlay */}
        <div className="absolute inset-0 opacity-40 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </section>

      {/* SECTION 2: ACTIVE RACES (Conversion) */}
      <section
        id="active-races"
        className="max-w-7xl mx-auto py-24 px-6 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">
              Active <span className="text-zinc-400">Races</span>
            </h2>
            <p className="text-zinc-500 uppercase tracking-widest text-xs mt-2">
              Pick your challenge and claim your BIB
            </p>
          </div>
          <Link
            href="/past-events"
            className="text-sm font-bold uppercase border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all"
          >
            View History
          </Link>
        </div>

        {/* Dynamic Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeEvents && activeEvents.length > 0 ? (
            activeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
              <p className="text-zinc-400 italic">
                No active races at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: FEATURES (Value Prop) */}
      <section className="bg-zinc-50 py-20 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-3">
            <h3 className="font-black italic text-xl uppercase">Fast BIBs</h3>
            <p className="text-sm text-zinc-500">
              Instant BIB assignment upon payment verification via Razorpay.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-black italic text-xl uppercase">
              Live Tracking
            </h3>
            <p className="text-sm text-zinc-500">
              Follow athlete progress through every checkpoint in real-time.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-black italic text-xl uppercase">
              Digital Medals
            </h3>
            <p className="text-sm text-zinc-500">
              Download your achievement certificates immediately after crossing
              the finish line.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
