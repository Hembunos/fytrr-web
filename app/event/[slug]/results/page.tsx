import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: event } = await supabase
    .from("events")
    .select(
      `
      name,
      participants (
        participant_name,
        bib_number,
        finish_time,
        rank
      )
    `
    )
    .eq("slug", slug)
    .order("rank", {
      foreignTable: "participants",
      ascending: true,
      nullsFirst: false,
    })
    .single();

  if (!event || !event.participants?.length) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-10 px-6 text-center">
        <div className="space-y-4">
          <p className="font-black uppercase italic text-3xl md:text-5xl tracking-tighter animate-pulse text-brand-success">
            Syncing Results...
          </p>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
            Official Timing In Progress
          </p>
        </div>
        <Link
          href="/"
          className="text-[11px] font-black uppercase border-b-2 border-white/10 pb-2 hover:text-brand-success hover:border-brand-success transition-all italic"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-brand-success selection:text-black font-sans">
      {/* ⬛ Background Decorative Text */}
      <div className="absolute inset-0 z-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="text-[20rem] md:text-[35rem] font-black italic uppercase text-white tracking-tighter -rotate-12">
          FINISH
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-20 md:space-y-32 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Official Leaderboard
          </div>
          <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">
            {event.name} <br />
            <span className="text-white/10">Standings</span>
          </h1>
          <div className="h-1.5 w-24 bg-brand-success mx-auto rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        </div>

        {/* Leaderboard List */}
        <div className="grid grid-cols-1 gap-8">
          {event.participants.map((winner: any) => (
            <div
              key={winner.bib_number}
              className={`flex justify-between items-center p-8 md:p-12 rounded-race border transition-all duration-500 hover:scale-[1.01] ${
                winner.rank === 1
                  ? "bg-white text-black border-white shadow-[0_40px_80px_rgba(255,255,255,0.1)] z-10"
                  : "bg-white/[0.03] text-white border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-8 md:gap-14">
                {/* Rank Display */}
                <div className="flex flex-col items-center">
                  <span
                    className={`text-[9px] font-black uppercase tracking-[0.4em] mb-2 ${
                      winner.rank === 1 ? "text-black/30" : "text-white/20"
                    }`}
                  >
                    Rank
                  </span>
                  <span
                    className={`text-5xl md:text-7xl font-black italic leading-none tracking-tighter ${
                      winner.rank === 1 ? "text-black" : "text-brand-success"
                    }`}
                  >
                    #{winner.rank?.toString().padStart(2, "0") || "--"}
                  </span>
                </div>

                {/* Athlete Info */}
                <div className="space-y-3">
                  <p className="font-black text-2xl md:text-4xl uppercase italic tracking-tighter leading-none">
                    {winner.participant_name}
                  </p>
                  <p
                    className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${
                      winner.rank === 1 ? "text-black/40" : "text-white/30"
                    }`}
                  >
                    BIB: {winner.bib_number}
                  </p>
                </div>
              </div>

              {/* Timing Display */}
              <div className="text-right flex flex-col items-end">
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.4em] mb-3 ${
                    winner.rank === 1 ? "text-black/30" : "text-white/20"
                  }`}
                >
                  Finish Time
                </span>
                <p
                  className={`text-3xl md:text-6xl font-black italic tracking-tighter leading-none ${
                    winner.rank === 1 ? "text-black" : "text-white"
                  }`}
                >
                  {winner.finish_time || "DNS"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Footer */}
        <div className="text-center pt-12 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 italic">
            Beyond Limits • FYTRR Official Timing
          </p>
        </div>
      </div>
    </div>
  );
}