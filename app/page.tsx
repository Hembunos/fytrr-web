// import { createSupabaseServer } from "@/lib/supabase/server";
// import EventCard from "@/components/EventCard";
// import Link from "next/link";
// import type { Metadata } from "next";

// // SEO Optimization
// export const metadata: Metadata = {
//   title: "FYTRR RUN 2026 | Beyond Limits",
//   description:
//     "Official race platform for FYTRR RUN 2026 Dumka. Experience the ultimate Hyrox-inspired challenge. Claim your BIB and join the pace.",
//   openGraph: {
//     title: "FYTRR RUN 2026 | Dumka",
//     description: "Beyond Limits. The ultimate marathon and fitness challenge.",
//     images: ["/og-image.jpg"], // Ensure you have this in public folder
//   },
// };

// export default async function LandingPage() {
//   // 1. Initialize server client (SEO-friendly: content is rendered on server)
//   const supabase = await createSupabaseServer();

//   // 2. Fetch active events
//   const { data: activeEvents } = await supabase
//     .from("events")
//     .select("*")
//     .eq("is_active", true)
//     .order("event_date", { ascending: true });

//   return (
//     <div className="flex flex-col min-h-screen bg-brand-secondary">
//       {/* SECTION 1: HERO (Mobile-First & High Impact) */}
//       <section className="relative min-h-[90vh] md:h-[95vh] flex items-center justify-center bg-brand-primary overflow-hidden px-6">
//         {/* Radical Glow for Depth */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-transparent to-transparent opacity-60" />

//         <div className="z-10 text-center space-y-8 max-w-5xl">
//           <div className="space-y-4">
//             <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black italic tracking-tighter text-brand-secondary uppercase leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000">
//               Beyond <br /> <span className="text-brand-accent/30">Limits</span>
//             </h1>
//             <p className="text-brand-accent uppercase font-black tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-sm">
//               Dumka, Jharkhand | Official Race Platform • 2026
//             </p>
//           </div>

//           <div className="pt-8">
//             <Link
//               href="#active-races"
//               className="bg-brand-secondary text-brand-primary px-8 md:px-12 py-4 md:py-5 rounded-race font-black uppercase tracking-widest hover:bg-brand-success hover:text-brand-primary transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)] inline-block text-xs md:text-sm"
//             >
//               Explore Races
//             </Link>
//           </div>
//         </div>

//         {/* Background Grid - Visible on desktop, subtle on mobile */}
//         <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
//       </section>

//       {/* SECTION 2: ACTIVE RACES (SEO-Friendly Dynamic Grid) */}
//       <section
//         id="active-races"
//         className="relative max-w-7xl mx-auto py-24 md:py-32 px-6 w-full"
//       >
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
//           <div className="space-y-3">
//             <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-brand-primary">
//               Active <span className="text-brand-accent/40">Races</span>
//             </h2>
//             <div className="h-1.5 w-24 bg-brand-primary rounded-full" />
//             <p className="text-brand-accent uppercase font-black tracking-widest text-[10px] md:text-xs">
//               Pick your challenge and claim your official BIB
//             </p>
//           </div>
//           <Link
//             href="/past-events"
//             className="text-[11px] font-black uppercase border-b-2 border-brand-accent/20 pb-1 hover:text-brand-primary hover:border-brand-primary transition-all italic"
//           >
//             View Event History
//           </Link>
//         </div>

//         {/* Dynamic Grid: 1 on mobile, 2 on tablet, 3 on desktop */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
//           {activeEvents && activeEvents.length > 0 ? (
//             activeEvents.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))
//           ) : (
//             <div className="col-span-full py-32 text-center border-4 border-dashed border-brand-accent/10 rounded-race bg-zinc-50/50">
//               <p className="text-brand-accent font-black uppercase italic tracking-widest text-sm">
//                 No active races at the moment. Check back soon.
//               </p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* SECTION 3: FEATURES (Value Proposition) */}
//       <section className="bg-zinc-50 py-24 md:py-32 border-t border-zinc-200">
//         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
//           {[
//             {
//               title: "Fast BIBs",
//               desc: "Instant assignment via Razorpay. No waiting, no manual errors.",
//               color: "brand-primary",
//             },
//             {
//               title: "Live Timing",
//               desc: "Precision timing. Results published within minutes of finishing.",
//               color: "brand-accent",
//             },
//             {
//               title: "Verified",
//               desc: "Official podium results and digital medals available immediately.",
//               color: "brand-primary",
//             },
//           ].map((f, i) => (
//             <div key={i} className="space-y-4 text-center md:text-left group">
//               <div className="h-1.5 w-12 bg-brand-primary rounded-full mx-auto md:mx-0 group-hover:w-20 transition-all duration-500" />
//               <h3 className="font-black italic text-2xl uppercase tracking-tighter text-brand-primary">
//                 {f.title}
//               </h3>
//               <p className="text-sm text-brand-accent font-bold leading-relaxed uppercase">
//                 {f.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// import { createSupabaseServer } from "@/lib/supabase/server";
// import EventCard from "@/components/EventCard";
// import Link from "next/link";
// import Image from "next/image";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "FYTRR RUN 2026 | Beyond Limits",
//   description:
//     "Official race platform for FYTRR RUN 2026 Dumka. Experience the ultimate Hyrox-inspired challenge.",
// };

// export default async function LandingPage() {
//   const supabase = await createSupabaseServer();

//   const { data: activeEvents } = await supabase
//     .from("events")
//     .select("*")
//     .eq("is_active", true)
//     .order("event_date", { ascending: true });

//   return (
//     <div className="flex flex-col min-h-screen bg-brand-secondary overflow-x-hidden">
//       {/* SECTION 1: HERO (Mobile Optimized & High Impact) */}
//       <section className="relative h-[85vh] md:h-[95vh] flex items-center justify-center bg-brand-primary overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/hero-race.webp"
//             alt="FYTRR RUN 2026 Beyond Limits"
//             fill
//             priority
//             className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/80 via-transparent to-brand-primary/90" />
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent opacity-80" />
//         </div>

//         <div className="z-10 text-center px-6 space-y-6 md:space-y-10 max-w-6xl">
//           <div className="space-y-4 md:space-y-6">
//             {/* Breakpoints fix text size for mobile */}
//             <h1 className="text-5xl sm:text-7xl md:text-[10rem] lg:text-[12rem] font-black italic tracking-tighter text-brand-secondary uppercase leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000">
//               Beyond <br /> <span className="text-brand-accent/20">Limits</span>
//             </h1>
//             <p className="text-brand-accent uppercase font-black tracking-[0.2em] md:tracking-[0.6em] text-[9px] md:text-sm max-w-2xl mx-auto leading-loose">
//               Dumka, Jharkhand | Official Race Platform • 2026
//             </p>
//           </div>

//           <div className="pt-4 md:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link
//               href="#active-races"
//               className="w-full sm:w-auto bg-brand-secondary text-brand-primary px-10 py-5 rounded-race font-black uppercase tracking-widest hover:bg-brand-success transition-all active:scale-95 shadow-2xl text-[10px] md:text-sm text-center"
//             >
//               Explore Races
//             </Link>
//           </div>
//         </div>

//         <div className="absolute inset-0 z-[1] opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
//       </section>

//       {/* SECTION 2: ACTIVE RACES (Responsive Grid & Perfect Alignment) */}
//       <section
//         id="active-races"
//         className="max-w-7xl mx-auto py-20 md:py-32 px-6 w-full"
//       >
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
//           <div className="space-y-4">
//             <div className="h-1.5 w-20 bg-brand-primary rounded-full" />
//             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-brand-primary leading-none">
//               Active <span className="text-brand-accent/30">Races</span>
//             </h2>
//             <p className="text-brand-accent uppercase font-black tracking-widest text-[10px] md:text-xs">
//               Pick your challenge and claim your official BIB
//             </p>
//           </div>

//           <Link
//             href="/past-events"
//             className="group flex items-center gap-2 text-[10px] md:text-xs font-black uppercase border-b-2 border-brand-accent/10 pb-1 text-brand-primary hover:text-brand-success transition-all italic w-fit"
//           >
//             View Event History
//             <svg
//               className="group-hover:translate-x-1 transition-transform"
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="4"
//             >
//               <path d="M5 12h14M12 5l7 7-7 7" />
//             </svg>
//           </Link>
//         </div>

//         {/* 1 col on Mobile, 2 on Tablet, 3 on Desktop. Items-stretch for same card height */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-stretch">
//           {activeEvents && activeEvents.length > 0 ? (
//             activeEvents.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))
//           ) : (
//             <div className="col-span-full py-24 md:py-40 text-center border-4 border-dashed border-brand-accent/5 rounded-race bg-brand-muted/5">
//               <p className="text-brand-accent font-black uppercase italic tracking-widest text-xs md:text-sm">
//                 No active races at the moment. Check back soon.
//               </p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* SECTION 3: FEATURES (Numbers Fix) */}
//       {/* SECTION 3: FEATURES (Refined Implementation) */}
//       <section className="bg-brand-muted/5 py-24 md:py-40 border-t border-brand-accent/5 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-12">
//           {[
//             {
//               title: "Fast BIBs",
//               desc: "Instant assignment via Razorpay. No waiting, no manual errors.",
//             },
//             {
//               title: "Live Timing",
//               desc: "Precision timing. Results published within minutes of finishing.",
//             },
//             {
//               title: "Verified",
//               desc: "Official podium results and digital medals available immediately.",
//             },
//           ].map((f, i) => (
//             <div
//               key={i}
//               className="relative group flex flex-col items-center md:items-start"
//             >
//               {/* Number and Line Container */}
//               <div className="relative flex items-end justify-center md:justify-start w-full h-24 md:h-32 mb-6">
//                 {/* Background Number */}
//                 <span className="absolute bottom-0 text-8xl md:text-[11rem] font-black italic text-brand-primary/5 select-none leading-none pointer-events-none z-0">
//                   0{i + 1}
//                 </span>

//                 {/* Green Line - Pushed slightly further down */}
//                 <div className="relative z-10 h-1.5 w-12 bg-brand-success rounded-full group-hover:w-24 transition-all duration-500 translate-y-2 md:translate-y-4" />
//               </div>

//               {/* Text Content */}
//               <div className="text-center md:text-left space-y-4">
//                 <h3 className="font-black italic text-3xl md:text-4xl uppercase tracking-tighter text-brand-primary leading-tight">
//                   {f.title}
//                 </h3>

//                 <p className="text-[11px] md:text-xs text-brand-accent font-black leading-relaxed uppercase tracking-widest opacity-70 max-w-[260px]">
//                   {f.desc}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }


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
      <section className="bg-black py-24 md:py-48 border-t border-white/5 relative overflow-hidden">
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
              <div className="relative h-32 mb-8 flex items-end">
                <span className="absolute bottom-0 text-[12rem] font-black italic text-white/[0.02] leading-none select-none">
                  0{i + 1}
                </span>
                <div className="h-1.5 w-16 bg-brand-success group-hover:w-24 transition-all duration-700 shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
              </div>
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