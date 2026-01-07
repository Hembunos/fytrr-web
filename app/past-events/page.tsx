import { createSupabaseServer } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default async function PastEventsPage() {
  const supabase = await createSupabaseServer();

  // Filter for inactive events
  const { data: pastEvents, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", false)
    .order("event_date", { ascending: false });

  return (
    <div className="relative min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-brand-success selection:text-black font-sans overflow-x-hidden">
      {/* ⬛ Giant Decorative Background Text */}
      <div className="absolute top-0 left-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center overflow-hidden h-full w-full">
        <div className="text-[15rem] md:text-[25rem] font-black italic uppercase text-white tracking-tighter -rotate-12">
          HISTORY
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 pt-10">
        {/* Header Section: Matches Layout Typography */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 border-b border-white/5 pb-16 text-center md:text-left">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              The Vault
            </div>
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
              Past <br />{" "}
              <span className="text-white/10 font-black">Events</span>
            </h1>
            <p className="text-white/40 uppercase font-black tracking-[0.5em] text-[10px] border-l-2 border-brand-success pl-4">
              The Hall of Fame • FYTRR Legacy
            </p>
          </div>
          <Link
            href="/"
            className="text-[11px] font-black uppercase border-b-2 border-white/10 pb-2 hover:text-brand-success hover:border-brand-success transition-all italic tracking-widest"
          >
            ← Back to Active Races
          </Link>
        </div>

        {/* Content Section */}
        {!pastEvents || pastEvents.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm space-y-6">
            <div className="text-6xl grayscale opacity-20">🏁</div>
            <p className="text-white/20 font-black uppercase tracking-[0.3em] italic text-xs md:text-sm">
              No past events found yet. The history is being written...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="group transition-all duration-500 hover:-translate-y-2"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
