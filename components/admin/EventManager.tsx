"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client"; // Use createClient for consistent client instance
import CategoryManager from "./CategoryManager";
import { useRouter } from "next/navigation";

export default function EventManager({ event }: { event: any }) {
  const [loading, setLoading] = useState(false);
  const [showAthletes, setShowAthletes] = useState(false); // Result management toggle
  const router = useRouter();

  // 1. Calculate Athletes (Paid only)
  const totalAthletes =
    event.registrations?.reduce(
      (acc: number, reg: any) =>
        reg.status === "paid" ? acc + (reg.participants?.length || 0) : acc,
      0
    ) || 0;

  // 2. Calculate Revenue from Payments Table
  const totalRevenue =
    event.registrations?.reduce((regAcc: number, reg: any) => {
      const regPayment =
        reg.payments?.reduce((payAcc: number, pay: any) => {
          return pay.status === "success" ? payAcc + (pay.amount || 0) : payAcc;
        }, 0) || 0;
      return regAcc + regPayment;
    }, 0) || 0;



  const handleDelete = async () => {
    if (totalAthletes > 0) {
      alert("CRITICAL: Cannot delete event. Athletes are already registered!");
      return;
    }

    if (
      !confirm(
        "Are you sure? This will permanently delete the event and categories."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert(`FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({ is_active: !event.is_active })
        .eq("id", event.id);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert(`Update Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // EventManager.tsx ke andar ye functions update karein
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleResultUpdate = async (
    pId: string,
    rank: string,
    time: string
  ) => {
    setUpdatingId(pId); // Loading shuru
    const { error } = await supabase
      .from("participants")
      .update({
        rank: rank ? parseInt(rank) : null,
        finish_time: time,
      })
      .eq("id", pId);

    setUpdatingId(null); // Loading khatam

    if (error) {
      alert("Update Failed: " + error.message);
    } else {
      // Bina page reload kiye data sync karne ke liye
      router.refresh();
    }
  };

  return (
    <div className="bg-white border border-black/5 rounded-[2rem] p-5 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 mb-6 group overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* 🟢 LEFT SECTION: Info & Results */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Status & Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full italic tracking-widest shadow-sm ${
                    event.is_active
                      ? "bg-brand-success text-black animate-pulse"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  {event.is_active ? "● Live" : "○ Draft"}
                </span>
                <span className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em]">
                  {event.location}
                </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-black">
                {event.name}
              </h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">
                {new Date(event.event_date).toDateString()}
              </p>
            </div>

            {/* Compact Stats Row */}
            <div className="flex gap-3 max-w-lg">
              <div className="bg-black px-5 py-3 rounded-2xl flex-1 shadow-lg">
                <p className="text-[7px] font-black text-brand-success/60 uppercase tracking-widest mb-0.5">
                  Revenue
                </p>
                <p className="text-xl font-black italic text-white leading-none">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-zinc-50 px-5 py-3 rounded-2xl flex-1 border border-black/5">
                <p className="text-[7px] font-black text-black/30 uppercase tracking-widest mb-0.5">
                  Athletes
                </p>
                <p className="text-xl font-black italic text-black leading-none">
                  {totalAthletes.toString().padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>

          {/* Result Action Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowAthletes(!showAthletes)}
              className={`flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition-all shadow-md ${
                showAthletes
                  ? "bg-zinc-100 text-black border border-black/10"
                  : "bg-black text-white hover:bg-brand-success hover:text-black"
              }`}
            >
              {showAthletes ? "✕ Close Results" : "⚙ Manage Athlete Data"}
            </button>
          </div>
        </div>

        {/* ⬛ RIGHT SECTION: Category Sidebar (Optimized Width) */}
        <div className="lg:w-[320px] bg-black text-white p-6 rounded-[1.8rem] flex flex-col justify-between shrink-0 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-success italic">
                Setup Control
              </p>
              <span className="text-[10px] text-white/20 font-black italic">
                FYT-v1
              </span>
            </div>

            {/* Category Logic with Scale Fix */}
            <div className="overflow-visible">
              <CategoryManager
                eventId={event.id}
                initialCategories={event.categories}
              />
            </div>
          </div>

          {/* Sidebar Quick Actions */}
          <div className="relative z-10 pt-6 border-t border-white/10 space-y-2 mt-4">
            <button
              onClick={toggleActive}
              className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                event.is_active
                  ? "border-brand-success/50 text-brand-success hover:bg-brand-success/10"
                  : "border-white/20 text-white/40"
              }`}
            >
              {event.is_active ? "● Suspend Reg" : "○ Launch Event"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-red-500/30 py-2 text-[8px] font-black uppercase hover:text-red-500 transition-all italic tracking-tighter"
            >
              Terminate Record
            </button>
          </div>
        </div>
      </div>

      {/* 📜 Result List - Full Width below the top row */}
      {showAthletes && (
        <div className="mt-8 pt-8 border-t-2 border-zinc-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="block w-full max-h-[450px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {event.registrations
              ?.flatMap((reg: any) => reg.participants || [])
              .filter((p: any) => p.bib_number)
              .sort((a: any, b: any) =>
                a.bib_number.localeCompare(b.bib_number, undefined, {
                  numeric: true,
                })
              )
              .map((participant: any) => (
                <div
                  key={participant.id}
                  className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border transition-all shrink-0 ${
                    updatingId === participant.id
                      ? "bg-brand-success/5 border-brand-success"
                      : "bg-zinc-50 border-zinc-100 hover:border-zinc-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2.5 w-2.5 rounded-full shrink-0 border-2 border-white shadow-sm ${
                        participant.rank && participant.finish_time
                          ? "bg-brand-success animate-pulse"
                          : "bg-zinc-300"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-black uppercase italic leading-none text-black">
                        {participant.participant_name}
                      </p>
                      <p className="text-[8px] font-black text-white bg-black px-2 py-0.5 rounded mt-1 inline-block tracking-widest">
                        BIB: {participant.bib_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-center mt-4 md:mt-0">
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[7px] font-black text-black/30 ml-1">
                        RANK
                      </label>
                      <input
                        type="number"
                        defaultValue={participant.rank}
                        className="w-16 bg-white border border-zinc-200 rounded-lg px-2 py-2 text-[10px] font-black outline-none focus:border-black"
                        onBlur={(e) =>
                          handleResultUpdate(
                            participant.id,
                            e.target.value,
                            participant.finish_time
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[7px] font-black text-black/30 ml-1">
                        TIME
                      </label>
                      <input
                        type="text"
                        placeholder="00:00:00"
                        defaultValue={participant.finish_time}
                        className="w-28 bg-white border border-zinc-200 rounded-lg px-2 py-2 text-[10px] font-black outline-none focus:border-black"
                        onBlur={(e) =>
                          handleResultUpdate(
                            participant.id,
                            String(participant.rank || ""),
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
