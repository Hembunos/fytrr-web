"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import CategoryManager from "./CategoryManager";
import { useRouter } from "next/navigation";

export default function EventManager({ event }: { event: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Calculate Athletes (Paid only)
  const totalAthletes =
    event.registrations?.reduce(
      (acc: number, reg: any) =>
        reg.status === "paid" ? acc + (reg.participants?.length || 0) : acc,
      0
    ) || 0;

  // 2. Calculate Revenue from Payments Table (Most Accurate)
  const totalRevenue =
    event.registrations?.reduce((regAcc: number, reg: any) => {
      const regPayment =
        reg.payments?.reduce((payAcc: number, pay: any) => {
          return pay.status === "success" ? payAcc + (pay.amount || 0) : payAcc;
        }, 0) || 0;
      return regAcc + regPayment;
    }, 0) || 0;

  const handleDelete = async () => {
    // 1. Safety Check: Registrations check
    if (totalAthletes > 0) {
      alert("CRITICAL: Cannot delete event. Athletes are already registered!");
      return;
    }

    // 2. Confirmation
    if (
      !confirm(
        "Are you sure? This will permanently delete the event and categories."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // 3. Supabase Deletion
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      // 4. CRITICAL FIX: router.refresh() page reload ko rokega
      // Isse dashboard smooth rahega aur white screen nahi aayegi
      router.refresh();
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(`FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async () => {
    setLoading(true); // Same loading state use kar sakte hain jo delete ke liye hai
    try {
      const { error } = await supabase
        .from("events")
        .update({ is_active: !event.is_active }) // Current state ko ulta (toggle) kar dega
        .eq("id", event.id);

      if (error) throw error;

      // Bina page reload kiye UI refresh
      router.refresh();
      
    } catch (err: any) {
      alert(`Update Failed: ${err.message}`);
    } finally {
      setLoading(false);
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
        </div>

        {/* Category Management */}
        <div className="lg:w-1/3 bg-zinc-900 text-white p-6 rounded-[2rem] space-y-4 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Category Intelligence
          </p>
          <CategoryManager
            eventId={event.id}
            initialCategories={event.categories}
          />

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <p className="text-[9px] font-black uppercase text-zinc-600 mb-2">
              Live Controls
            </p>

            {/* TOGGLE BUTTON */}
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
