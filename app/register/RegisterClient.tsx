"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast, Toaster } from "sonner";
import Link from "next/link";

// Define the interface to prevent deployment type errors
interface CategoryWithEvent {
  name: string;
  price: number;
  event_id: string;
  events: {
    location: string;
    name: string;
  };
}

export default function RegisterClient() {
  const params = useSearchParams();
  const router = useRouter();
  const categoryId = params.get("category");

  const [userId, setUserId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  // Updated state to include joined event data
  const [categoryData, setCategoryData] = useState<CategoryWithEvent | null>(
    null
  );

  /* ───────── 1. AUTH & CATEGORY FETCH (With Location Join) ───────── */
  useEffect(() => {
    if (!categoryId) {
      router.replace("/");
      return;
    }

    const initData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace(
          `/login?redirectTo=${encodeURIComponent(
            `/register?category=${categoryId}`
          )}`
        );
        return;
      }
      setUserId(user.id);

      // Join with events table to get the location
      const { data: category } = await supabase
        .from("categories")
        .select(
          `
          name, 
          price, 
          event_id,
          events (
            location,
            name
          )
        `
        )
        .eq("id", categoryId)
        .single();

      if (category) setCategoryData(category as any);
    };

    initData();
  }, [categoryId, router]);

  const cleanedNames = useMemo(
    () => participants.filter((p) => p.trim() !== ""),
    [participants]
  );
  const totalAmount = (categoryData?.price || 0) * (cleanedNames.length || 1);

  /* ───────── 2. REGISTRATION HANDLER ───────── */
  async function handleRegister() {
    if (!userId || !categoryData || loading) return;

    if (cleanedNames.length === 0) {
      toast.error("Athlete ka naam likhna zaroori hai! 🏃‍♂️", {
        description: "Kam se kam ek naam add karein.",
        style: {
          background: "#000",
          color: "#fff",
          border: "1px solid #22c55e",
        },
      });
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Details save ho rahi hain...");

    try {
      const { data: registration, error: regError } = await supabase
        .from("registrations")
        .insert({
          user_id: userId,
          category_id: categoryId,
          event_id: categoryData.event_id,
          status: "pending",
        })
        .select()
        .single();

      if (regError || !registration)
        throw new Error("Could not initialize registration.");

      const { error: partError } = await supabase.from("participants").insert(
        cleanedNames.map((name) => ({
          registration_id: registration.id,
          participant_name: name.trim(),
        }))
      );

      if (partError) throw new Error("Failed to save participant details.");

      toast.success("Ready for Battle! 🏁", {
        description: "Redirecting to Payment Gateway...",
        id: loadingToast,
      });

      const { handlePayment } = await import("@/lib/checkout");
      await handlePayment(registration.id, () => setLoading(false));
    } catch (err: any) {
      console.error(err);
      toast.error("Registration Failed", {
        description: err.message || "Kuch gadbad ho gayi, firse try karo.",
        id: loadingToast,
      });
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-black selection:bg-brand-success selection:text-black overflow-x-hidden">
      <Toaster position="bottom-center" offset={40} richColors />

      {/* ⬛ HEADER / HERO */}
      <div className="relative w-full h-[400px] md:h-[450px] bg-[#050505] flex items-center md:items-end pb-12 md:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
          <div className="text-[14rem] md:text-[30rem] font-black italic uppercase leading-none text-white tracking-tighter -rotate-6">
            {categoryData?.name?.split(" ")[0] || "GO"}
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
          <div className="max-w-4xl space-y-4 md:space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
              <span className="px-4 py-1.5 bg-brand-success text-black rounded-full italic text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                ● Official Entry
              </span>
              <span className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px] italic border-l border-white/10 pl-4">
                {/* FIXED: Using categoryData.events.location to solve build error */}
                📍 {categoryData?.events?.location || "RANCHI, JHARKHAND"}
              </span>
            </div>

            <h1 className="text-6xl md:text-[8.5rem] font-black italic uppercase tracking-tighter leading-[0.82] text-white">
              {categoryData?.name || "Register"}
            </h1>

            <div className="flex items-center gap-3">
              <p className="text-brand-success font-black uppercase tracking-widest text-[11px] italic">
                {categoryData?.events?.name || "FYTRR RUN 2026"}
              </p>
              <div className="h-px w-8 bg-brand-success/30 hidden md:block" />
              <p className="hidden md:block text-white/30 font-black uppercase tracking-widest text-[11px] italic">
                SECURE PROTOCOL V1.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🧱 MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-12 -mt-16 md:-mt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="hidden lg:flex flex-col justify-between h-full py-8 pr-12 sticky top-24">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black italic uppercase text-white leading-tight">
                  FYTRR RUN <br /> 2026
                </h2>
                <div className="h-1.5 w-12 bg-brand-success rounded-full" />
              </div>

              <div className="space-y-4">
                <p className="text-white/50 font-black uppercase tracking-widest text-xs">
                  {categoryData?.name} • Official Entry Benefits
                </p>
                <ul className="grid grid-cols-1 gap-4 text-white/70 text-sm font-semibold">
                  {[
                    "Official Timing Chip",
                    "Verified Bib Allocation",
                    "Finisher Medal",
                    "Medical + Hydration Support",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 group">
                      <span className="h-2 w-2 bg-brand-success rounded-full group-hover:scale-150 transition-transform" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-12 border-t border-white/5">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] italic">
                Selection{" "}
                <span className="text-brand-success/40">→ Details</span> →
                Payment
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-12 space-y-10 bg-white rounded-[2.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.8)] border-t-[8px] border-black relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none select-none">
                <span className="text-4xl font-black italic">STEP 02</span>
              </div>

              <div className="space-y-6">
                <div className="flex gap-2">
                  <div className="h-1.5 w-1/3 bg-brand-success rounded-full" />
                  <div className="h-1.5 w-1/3 bg-brand-success rounded-full" />
                  <div className="h-1.5 w-1/3 bg-black/10 rounded-full" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-black/40 italic">
                  <span className="px-3 py-1.5 bg-black text-white rounded italic font-black">
                    Step 02
                  </span>
                  <span className="text-brand-success">Athlete Details</span>
                </div>
                <p className="text-black/60 text-[11px] font-black uppercase tracking-widest border-l-2 border-black/10 pl-4 italic leading-relaxed">
                  Enter names exactly as they should appear on the official BIB
                  allocation system
                </p>
              </div>

              <div className="space-y-6">
                {participants.map((name, index) => (
                  <div
                    key={index}
                    className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <label className="text-[9px] uppercase font-black text-black/30 tracking-widest ml-1">
                      Athlete {index + 1}
                    </label>
                    <div className="flex gap-3">
                      <input
                        // FIXED: Added text-black to ensure visibility and high contrast
                        className="flex-1 border-2 border-black/5 rounded-2xl p-4 bg-[#f9f9f9] font-black italic uppercase text-sm text-black placeholder:text-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all duration-200"
                        placeholder="Full Name"
                        value={name}
                        disabled={loading}
                        onChange={(e) => {
                          const updated = [...participants];
                          updated[index] = e.target.value;
                          setParticipants(updated);
                        }}
                      />
                      {participants.length > 1 && !loading && (
                        <button
                          onClick={() =>
                            setParticipants(
                              participants.filter((_, i) => i !== index)
                            )
                          }
                          className="px-5 rounded-2xl bg-red-50 text-red-500 hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {!loading && (
                  <button
                    type="button"
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors duration-200"
                    onClick={() => setParticipants([...participants, ""])}
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-black/5 group-hover:bg-black group-hover:text-white transition-all font-black">
                      +
                    </span>
                    Add Athlete
                  </button>
                )}
              </div>

              <div className="bg-black text-white p-8 rounded-[2rem] space-y-5 shadow-2xl relative">
                <div className="flex justify-between text-[9px] uppercase font-black opacity-40 tracking-widest">
                  <span>Entry Summary</span>
                  <span>Subtotal</span>
                </div>
                <div className="flex justify-between items-end gap-4">
                  <div className="space-y-1">
                    <p className="font-black italic uppercase text-xl leading-none">
                      {categoryData?.name}
                    </p>
                    <p className="text-[10px] font-black text-brand-success uppercase tracking-tighter italic">
                      {participants.length || 1} × Verified Entry
                    </p>
                  </div>
                  <span className="text-4xl md:text-5xl font-black italic text-brand-success leading-none">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleRegister}
                className={`w-full p-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                ${
                  loading
                    ? "bg-black/60 text-white/50 cursor-not-allowed"
                    : "bg-black text-white hover:bg-brand-success hover:text-black hover:-translate-y-1 active:scale-[0.97]"
                }`}
              >
                {loading ? "Securing Spot..." : "Proceed to Payment →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}