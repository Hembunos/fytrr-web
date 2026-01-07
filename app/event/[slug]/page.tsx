import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import CountdownTimer from "@/components/CountdownTimer";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!event) return notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  return (
    <div className="relative min-h-screen bg-black font-sans selection:bg-brand-success selection:text-black overflow-x-hidden">
      {/* ⬛ Hero Header: Adjusted Height & Padding to match Dashboard elite look */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-[#050505] flex items-end pb-16 md:pb-24 overflow-hidden border-b border-white/5">
        {/* Background Giant Text - Synced with Dashboard background portal style */}
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
          <div className="text-[18rem] md:text-[30rem] font-black italic uppercase leading-none text-white tracking-tighter -rotate-6">
            {event.name.split(" ")[0]}
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-brand-success text-black text-[9px] font-black uppercase tracking-wider rounded-full italic shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                  ● Registration Active
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic border-l border-white/10 pl-4">
                  📍 {event.location}
                </span>
              </div>

              <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white animate-in fade-in slide-in-from-left-8 duration-700">
                {event.name}
              </h1>
            </div>

            {/* Countdown Card: Simplified for alignment like Admin Dashboard widgets */}
            <div className="hidden md:block bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl mb-2">
              <p className="text-[8px] font-black uppercase text-white/30 mb-3 text-center tracking-[0.4em]">
                Battle Commences In
              </p>
              <div className="flex justify-center text-white scale-90 origin-bottom">
                <CountdownTimer targetDate={event.event_date} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏁 Main Content: Aligned with Dashboard overlap style */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 md:-mt-16 relative z-30 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left: Category Selection */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                SELECT <span className="text-white/20">PROTOCOL</span>
              </h2>
              <div className="h-1.5 w-16 bg-brand-success rounded-full" />
            </div>

            <div className="grid gap-8">
              {categories?.map((cat) => (
                <div
                  key={cat.id}
                  className="group relative p-8 md:p-10 rounded-[2.5rem] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 border-b-8 border-brand-success/5"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black">
                          {cat.name}
                        </h3>
                        {cat.price > 1000 && (
                          <span className="text-[8px] bg-black text-white px-3 py-1 rounded-full font-black uppercase tracking-widest italic">
                            PRO ELITE
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                        Official Finisher Medal • High-Performance BIB •
                        Refreshments
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-5xl font-black italic tracking-tighter text-black">
                        ₹{cat.price}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/register?category=${cat.id}`}
                    className="block mt-10 text-center py-5 rounded-2xl bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-success hover:text-black transition-all shadow-xl active:scale-95"
                  >
                    Claim Your Spot
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Race Intel Sidebar */}
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">
                Race Intel
              </h4>
              <ul className="space-y-8">
                {[
                  {
                    label: "Race Day",
                    value: new Date(event.event_date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    ),
                    icon: "⚡",
                  },
                  { label: "Flag Off", value: "05:30 AM", icon: "🏁" },
                  { label: "Timing", value: "Verified Chip", icon: "⏱️" },
                  {
                    label: "BIB Range",
                    value: `${categories?.[0]?.bib_prefix || "A"}-101 +`,
                    icon: "🏃",
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between items-center group"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-4">
                      <span className="text-lg">{item.icon}</span> {item.label}
                    </span>
                    <span className="text-lg font-black italic tracking-tighter text-white uppercase">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-10 border-t border-white/5">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-5">
                  <div className="relative h-3 w-3">
                    <div className="absolute inset-0 bg-brand-success rounded-full animate-ping opacity-75" />
                    <div className="relative h-3 w-3 bg-brand-success rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-white tracking-[0.2em]">
                      Live Fulfillment
                    </p>
                    <p className="text-[9px] text-white/40 font-bold uppercase">
                      BIBs generated instantly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}