import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Suspense } from "react";
import SuccessToast from "@/components/SuccessToast";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  /* 🔐 AUTH CHECK (Server Side) */
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  /* 📦 FETCH REGISTRATIONS */
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select(
      `
      id,
      status,
      created_at,
      events ( name, slug ),
      categories:categories!registrations_category_id_fkey (
        name,
        price,
        bib_prefix
      ),
      participants (
        id,
        participant_name,
        bib_number
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-red-500 font-black uppercase italic">
          Error loading data
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs font-bold underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const paidCount =
    registrations?.filter((r) => r.status === "paid").length || 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12 mb-20">
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>

      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
            Athlete <span className="text-zinc-300">Hub</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Manage your race identity
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-zinc-50 border border-zinc-100 px-6 py-3 rounded-2xl flex-1 md:flex-none">
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
              Total Races
            </p>
            <p className="text-xl font-black italic">
              {registrations?.length || 0}
            </p>
          </div>
          <div className="bg-black text-white px-6 py-3 rounded-2xl flex-1 md:flex-none shadow-xl shadow-zinc-200">
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
              Active BIBs
            </p>
            <p className="text-xl font-black italic text-green-400">
              {paidCount}
            </p>
          </div>
        </div>
      </div>

      {!registrations || registrations.length === 0 ? (
        <div className="relative group overflow-hidden flex flex-col items-center justify-center h-80 border-4 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50 space-y-6 transition-all hover:bg-white hover:border-zinc-200">
          <div className="text-6xl grayscale opacity-20">🏃‍♂️</div>
          <div className="text-center space-y-1">
            <p className="text-zinc-400 font-black uppercase italic tracking-[0.2em] text-sm">
              Your track is empty
            </p>
            <p className="text-zinc-300 text-[10px] font-bold uppercase">
              No registrations found yet
            </p>
          </div>
          <Link
            href="/"
            className="bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Find a Race
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {registrations.map((reg) => {
            const category = Array.isArray(reg.categories)
              ? reg.categories[0]
              : reg.categories;
            const event = Array.isArray(reg.events)
              ? reg.events[0]
              : reg.events;
            const participants = reg.participants || [];
            const isPaid = reg.status === "paid";

            return (
              <div
                key={reg.id}
                className="group relative border border-zinc-100 rounded-[2.5rem] p-1 shadow-sm hover:shadow-2xl transition-all duration-700 bg-white overflow-hidden"
              >
                {/* ⚡ High-Impact Status Bar */}
                <div
                  className={`h-1.5 w-full ${
                    isPaid ? "bg-green-500" : "bg-yellow-400"
                  }`}
                />

                <div className="p-8 md:p-10 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                            isPaid
                              ? "bg-green-50 text-green-600"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {reg.status}
                        </span>
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                          ID: #{reg.id.slice(0, 8)}
                        </p>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
                        {event?.name}{" "}
                        <span className="text-zinc-200 italic ml-2">
                          {category.name}
                        </span>
                      </h3>
                    </div>

                    <div className="bg-zinc-50 px-6 py-4 rounded-3xl border border-zinc-100 text-center md:text-right min-w-[140px]">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                        Fee Paid
                      </p>
                      <p className="text-2xl font-black italic">
                        ₹{category.price * participants.length}
                      </p>
                    </div>
                  </div>

                  {/* Participant Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center bg-zinc-50/50 border border-zinc-100 p-6 rounded-[1.5rem] hover:bg-white hover:border-black transition-all group/p"
                      >
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase font-black text-zinc-400 tracking-widest">
                            Competitor
                          </p>
                          <p className="text-lg font-black uppercase italic text-black">
                            {p.participant_name}
                          </p>
                        </div>

                        {isPaid && p.bib_number ? (
                          <div className="text-right flex flex-col items-center">
                            <p className="text-[8px] uppercase font-black text-zinc-400 tracking-widest mb-1">
                              BIB
                            </p>
                            <span className="font-black text-lg bg-black text-white px-5 py-2 rounded-2xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
                              {p.bib_number}
                            </span>
                          </div>
                        ) : (
                          <div className="animate-pulse flex items-center gap-2">
                            <div className="h-2 w-2 bg-zinc-300 rounded-full" />
                            <span className="text-[9px] text-zinc-400 font-black uppercase italic">
                              Syncing...
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {isPaid && (
                    <div className="pt-6">
                      <Link
                        href={`/event/${event?.slug}/results`}
                        className="flex items-center justify-center gap-3 w-full bg-zinc-950 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all hover:shadow-2xl active:scale-[0.98]"
                      >
                        View Official Leaderboard
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
