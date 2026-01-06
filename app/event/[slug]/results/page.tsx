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
    // LTE 3 hata do agar sabka result dikhana hai, ya rehne do agar sirf podium chahiye
    .order("rank", {
      foreignTable: "participants",
      ascending: true,
      nullsFirst: false,
    })
    .single();

  if (!event || !event.participants?.length) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <p className="font-black uppercase italic text-xl tracking-widest animate-pulse">
          Results coming soon for {slug}...
        </p>
        <Link
          href="/"
          className="text-xs font-bold border-b border-white pb-1 uppercase"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
            {event.name} <br />{" "}
            <span className="text-zinc-800">Leaderboard</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {event.participants.map((winner: any) => (
            <div
              key={winner.bib_number}
              className={`flex justify-between items-center p-8 rounded-[2rem] border-2 transition-all ${
                winner.rank === 1
                  ? "bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.1)] scale-[1.02]"
                  : "bg-zinc-950 text-white border-zinc-900"
              }`}
            >
              <div className="flex items-center gap-8">
                <span
                  className={`text-4xl font-black italic ${
                    winner.rank === 1 ? "text-zinc-300" : "text-zinc-800"
                  }`}
                >
                  #
                  {winner.rank ? winner.rank.toString().padStart(2, "0") : "--"}
                </span>
                <div>
                  <p className="font-black text-xl md:text-2xl uppercase italic tracking-tighter">
                    {winner.participant_name}
                  </p>
                  <p className="text-[10px] font-bold uppercase opacity-40">
                    BIB: {winner.bib_number}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-black italic">
                  {winner.finish_time || "DNS"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
