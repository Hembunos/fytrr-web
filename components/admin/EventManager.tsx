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

  // Update Rank & Time Logic
  // const handleResultUpdate = async (
  //   pId: string,
  //   rank: string,
  //   time: string
  // ) => {
  //   const { error } = await supabase
  //     .from("participants")
  //     .update({
  //       rank: rank ? parseInt(rank) : null,
  //       finish_time: time,
  //     })
  //     .eq("id", pId);

  //   if (error) {
  //     alert("Update Failed: " + error.message);
  //   } else {
  //     console.log("Result saved for:", pId);
  //   }
  // };

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
    <div className="bg-white border-2 border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:border-black transition-all mb-6">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="space-y-4 flex-1">
          {/* Status & Name */}
          <div>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                event.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {event.is_active ? "Active" : "Draft"}
            </span>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mt-2">
              {event.name}
            </h3>
            <p className="text-xs text-zinc-400 font-bold uppercase">
              {event.location} • {new Date(event.event_date).toDateString()}
            </p>
          </div>
          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-zinc-50 p-4 rounded-2xl border">
              <p className="text-[9px] font-black text-zinc-400 uppercase">
                Total Revenue
              </p>
              <p className="text-xl font-black italic">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl border">
              <p className="text-[9px] font-black text-zinc-400 uppercase">
                Paid Athletes
              </p>
              <p className="text-xl font-black italic">{totalAthletes}</p>
            </div>
          </div>

          {/* --- RESULT MANAGEMENT SECTION --- */}
          <div className="mt-6 border-t pt-6">
            <button
              onClick={() => setShowAthletes(!showAthletes)}
              className="text-[10px] font-black uppercase bg-black text-white px-6 py-2 rounded-xl hover:bg-zinc-800 transition-all"
            >
              {showAthletes ? "Close Results" : "Manage Race Results"}
            </button>

            {showAthletes && (
              <div className="mt-6 space-y-3">
                {event.registrations
                  ?.flatMap((reg: any) => reg.participants || [])
                  .filter((p: any) => p.bib_number)
                  // ✅ Stable sorting taaki rank update karne par list jump na kare
                  .sort((a: any, b: any) =>
                    a.bib_number.localeCompare(b.bib_number, undefined, {
                      numeric: true,
                      sensitivity: "base",
                    })
                  )
                  .map((participant: any) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border transition-all ${
                        updatingId === participant.id
                          ? "border-yellow-400 opacity-70"
                          : "border-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* ✅ 🟢 Green: Pura | 🟠 Orange: Adhura | ⚪ Grey: Pending */}
                        <div
                          className={`h-2 w-2 rounded-full transition-all duration-500 ${
                            participant.rank && participant.finish_time
                              ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                              : participant.rank || participant.finish_time
                              ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                              : "bg-zinc-300"
                          }`}
                        />
                        <div>
                          <p className="text-[10px] font-black uppercase italic leading-none">
                            {participant.participant_name}
                          </p>
                          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            BIB: {participant.bib_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        {/* ✅ Dynamic Status Indicators */}
                        <div className="min-w-[70px] text-right mr-2">
                          {updatingId === participant.id ? (
                            <span className="text-[8px] font-black text-yellow-600 animate-pulse uppercase">
                              Saving...
                            </span>
                          ) : participant.rank && participant.finish_time ? (
                            <span className="text-[8px] font-black text-green-600 uppercase">
                              ✓ Complete
                            </span>
                          ) : participant.rank || participant.finish_time ? (
                            <span className="text-[8px] font-black text-orange-600 uppercase">
                              ! Incomplete
                            </span>
                          ) : null}
                        </div>

                        <input
                          type="number"
                          placeholder="Rank"
                          defaultValue={participant.rank}
                          disabled={updatingId === participant.id}
                          className="w-16 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-[10px] font-black disabled:opacity-50"
                          onBlur={(e) => {
                            if (
                              e.target.value !== String(participant.rank || "")
                            ) {
                              handleResultUpdate(
                                participant.id,
                                e.target.value,
                                participant.finish_time
                              );
                            }
                          }}
                        />
                        <input
                          type="text"
                          placeholder="HH:MM:SS"
                          defaultValue={participant.finish_time}
                          disabled={updatingId === participant.id}
                          className="w-28 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-[10px] font-black disabled:opacity-50"
                          onBlur={(e) => {
                            if (
                              e.target.value !== (participant.finish_time || "")
                            ) {
                              handleResultUpdate(
                                participant.id,
                                String(participant.rank || ""),
                                e.target.value
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Management Side */}
        <div className="lg:w-1/3 bg-zinc-900 text-white p-6 rounded-[2rem] space-y-4 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Category Intelligence
          </p>
          <CategoryManager
            eventId={event.id}
            initialCategories={event.categories}
          />
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <button
              onClick={toggleActive}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${
                event.is_active
                  ? "border-green-900 text-green-500 hover:bg-green-950"
                  : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {event.is_active
                ? "● Pause Registrations"
                : "○ Resume Registrations"}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full border border-red-900 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-950 transition-all disabled:opacity-50"
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
