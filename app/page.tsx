import { createSupabaseServer } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FYTRR RUN 2026 | Beyond Limits",
  description:
    "Official race platform for FYTRR RUN 2026. Experience the ultimate Hyrox-inspired challenge.",
};

export default async function LandingPage() {
  const supabase = await createSupabaseServer();

  const { data: activeEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("event_date", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden selection:bg-brand-success selection:text-black">
      {/* SECTION 1: HERO (Pure Stealth) */}
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center bg-black overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-race.webp"
            alt="FYTRR RUN 2026"
            fill
            priority
            className="object-cover opacity-40 grayscale"
          />
          {/* Refined Gradient - Bottom transition cleaner */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black" />
        </div>

        <div className="z-10 text-center px-6 space-y-6 md:space-y-10 max-w-6xl">
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-8xl md:text-[11rem] font-black italic tracking-tighter text-white uppercase leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Beyond <br /> <span className="text-white/10">Limits</span>
            </h1>
            <p className="text-brand-success uppercase font-black tracking-[0.4em] text-[9px] md:text-xs max-w-2xl mx-auto border-y border-white/10 py-5 mt-4 md:mt-8">
              Dumka, Jharkhand • Official Race Platform • 2026
            </p>
          </div>

          <div className="pt-6">
            <Link
              href="#active-races"
              className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-brand-success transition-all active:scale-95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-[11px] italic"
            >
              Explore Races
              <span className="group-hover:translate-x-2 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: ACTIVE RACES (Pure Black Theme) */}
      <section
        id="active-races"
        className="relative py-24 md:py-40 bg-black overflow-hidden"
      >
        {/* Background Decorative Text - Synced with Portal Vibe */}
        <div className="absolute top-20 left-0 w-full opacity-[0.02] select-none pointer-events-none flex justify-center">
          <div className="text-[15rem] md:text-[30rem] font-black italic uppercase text-white tracking-tighter -rotate-6">
            BATTLE
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-1 w-16 bg-brand-success shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                <span className="text-brand-success font-black uppercase tracking-[0.5em] text-[10px]">
                  Live Events
                </span>
              </div>
              <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
                ACTIVE <span className="text-white/10">RACES</span>
              </h2>
              <p className="text-white/30 uppercase font-black tracking-[0.3em] text-[10px] md:text-xs max-w-sm border-l-2 border-brand-success pl-5 leading-relaxed italic">
                Pick your challenge and claim your official BIB for the upcoming
                season
              </p>
            </div>

            <Link
              href="/past-events"
              className="group flex items-center gap-4 text-[10px] font-black uppercase text-white/40 hover:text-brand-success transition-all italic border-b border-white/5 pb-3 tracking-widest"
            >
              View Event History
              <svg
                className="group-hover:translate-x-3 transition-transform duration-500"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid with Overlap Correction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14 items-stretch relative z-20">
            {activeEvents && activeEvents.length > 0 ? (
              activeEvents.map((event) => (
                <div
                  key={event.id}
                  className="group transition-transform duration-500 hover:-translate-y-2"
                >
                  {/* EventCard White Theme matches Dashboard Card Style */}
                  <EventCard event={event} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
                <p className="text-white/20 font-black uppercase italic tracking-[0.5em] text-lg md:text-2xl">
                  No active races at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES (Sync with Protocol Vibe) */}
      <section className="bg-black py-24 md:py-48 border-t border-white/5 relative overflow-visible">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-20 relative z-10">
          {[
            {
              title: "Fast BIBs",
              desc: "Instant assignment via Razorpay. No waiting, no manual errors.",
            },
            {
              title: "Live Timing",
              desc: "Precision timing. Results published within minutes.",
            },
            {
              title: "Verified",
              desc: "Official podium results and digital medals available immediately.",
            },
          ].map((f, i) => (
            <div key={i} className="relative group flex flex-col">
              {/* NUMBER + LINE */}
              <div className="relative h-44 mb-12 overflow-visible">
                {/* BIG NUMBER */}
                <span
                  className="
              absolute bottom-10 left-0
              text-[12rem]
              font-black italic
              leading-none
              select-none
              text-white/10
              pointer-events-none
            "
                >
                  0{i + 1}
                </span>

                {/* GREEN LINE */}
                <div
                  className="
              absolute bottom-0 left-0
              h-1.5 w-16 bg-brand-success
              group-hover:w-24 transition-all duration-700
              shadow-[0_0_15px_rgba(34,197,94,0.3)]
            "
                />
              </div>

              {/* TEXT */}
              <div className="space-y-4">
                <h3 className="font-black italic text-4xl uppercase tracking-tighter text-white">
                  {f.title}
                </h3>
                <p className="text-[10px] md:text-xs text-white/30 font-black leading-relaxed uppercase tracking-[0.3em] max-w-xs italic">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
