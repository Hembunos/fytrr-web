"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast, Toaster } from "sonner";

export default function RegisterClient() {
  const params = useSearchParams();
  const router = useRouter();
  const categoryId = params.get("category");

  const [userId, setUserId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<{
    name: string;
    price: number;
    event_id: string;
  } | null>(null);

  /* ───────── 1. AUTH & CATEGORY FETCH ───────── */
  useEffect(() => {
    if (!categoryId) {
      router.replace("/");
      return;
    }

    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace(`/login?redirectTo=${encodeURIComponent(`/register?category=${categoryId}`)}`);
        return;
      }
      setUserId(user.id);

      const { data: category } = await supabase
        .from("categories")
        .select("name, price, event_id")
        .eq("id", categoryId)
        .single();

      if (category) setCategoryData(category);
    };

    initData();
  }, [categoryId, router]);

  const cleanedNames = useMemo(
    () => participants.filter((p) => p.trim() !== ""),
    [participants]
  );
  const totalAmount = (categoryData?.price || 0) * cleanedNames.length;

  /* ───────── 2. REGISTRATION HANDLER ───────── */
  async function handleRegister() {
    if (!userId || !categoryData || loading) return;

    if (cleanedNames.length === 0) {
      toast.error("Athlete ka naam likhna zaroori hai! 🏃‍♂️", {
        description: "Kam se kam ek naam add karein.",
        style: { background: "#000", color: "#fff", border: "1px solid #22c55e" },
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

      if (regError || !registration) throw new Error("Could not initialize registration.");

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
      <div className="relative w-full h-[300px] md:h-[360px] bg-[#050505] flex items-end pb-14 overflow-hidden border-b border-white/5">
        {/* Background Word */}
        <div className="absolute inset-0 opacity-[0.025] select-none pointer-events-none flex items-center justify-center">
          <div className="text-[16rem] md:text-[28rem] font-black italic uppercase tracking-tighter -rotate-6 text-white">
            {categoryData?.name?.split(" ")[0] || "GO"}
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
          <div className="max-w-4xl space-y-5">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-brand-success text-black rounded-full italic text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                ● Official Entry
              </span>
              <span className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px] italic border-l border-white/10 pl-4">
                Protocol v1.0
              </span>
            </div>

            <h1 className="text-5xl md:text-[7.5rem] font-black italic uppercase tracking-tighter leading-[0.82] text-white">
              {categoryData?.name || "Register"}
            </h1>
          </div>
        </div>
      </div>

      {/* 🧱 MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-12 -mt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 🟢 LEFT CONTEXT (desktop only) */}
          <div className="hidden lg:flex flex-col justify-between h-full py-8 pr-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black italic uppercase text-white leading-tight">
                FYTRR RUN <br /> 2026
              </h2>

              <p className="text-white/50 font-black uppercase tracking-widest text-xs">
                {categoryData?.name} • Official Entry
              </p>

              <ul className="space-y-3 text-white/70 text-sm font-semibold">
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-brand-success rounded-full" />
                  Official Timing Chip
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-brand-success rounded-full" />
                  Verified Bib Allocation
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-brand-success rounded-full" />
                  Finisher Medal
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-brand-success rounded-full" />
                  Medical + Hydration Support
                </li>
              </ul>
            </div>

            <p className="text-white/20 text-xs font-black uppercase tracking-widest">
              Step 2 of 3 · Athlete Details
            </p>
          </div>

          {/* 🧾 FORM CARD */}
          <div className="flex justify-center">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-12 space-y-10 bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] border-t-[8px] border-black">
              {/* STEP HEADER */}
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="flex gap-2">
                  <div className="h-1 w-1/3 bg-brand-success rounded-full" />
                  <div className="h-1 w-1/3 bg-brand-success rounded-full" />
                  <div className="h-1 w-1/3 bg-black/10 rounded-full" />
                </div>

                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-black/40 italic">
                  <span className="px-3 py-1 bg-black text-white rounded italic">
                    Step 02
                  </span>
                  <span className="text-brand-success">Athlete Details</span>
                </div>

                <p className="text-black/60 text-[11px] font-black uppercase tracking-widest border-l-2 border-black/10 pl-4 italic">
                  Enter names exactly as they should appear on the official BIB
                </p>
              </div>

              {/* INPUTS */}
              <div className="space-y-6">
                {participants.map((name, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-[9px] uppercase font-black text-black/30 tracking-widest">
                      Athlete {index + 1}
                    </label>

                    <div className="flex gap-3">
                      <input
                        className="flex-1 border-2 border-black/10 rounded-2xl p-4 bg-[#fcfcfc] font-black italic uppercase text-sm focus:border-black focus:ring-4 focus:ring-black/5 outline-none"
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
                          className="px-4 rounded-2xl bg-red-50 text-red-500 hover:bg-black hover:text-white transition"
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
                    className="text-xs font-black uppercase tracking-widest text-black/40 hover:text-black"
                    onClick={() => setParticipants([...participants, ""])}
                  >
                    + Add Athlete
                  </button>
                )}
              </div>

              {/* PRICE SUMMARY */}
              <div className="bg-black text-white p-6 rounded-[2rem] space-y-4 shadow-xl">
                <div className="flex justify-between text-[9px] uppercase font-black opacity-40">
                  <span>Entry Summary</span>
                  <span>Subtotal</span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <p className="font-black italic uppercase truncate">
                    {categoryData?.name}
                  </p>
                  <span className="text-3xl md:text-4xl font-black italic text-brand-success">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                disabled={loading}
                onClick={handleRegister}
                className={`w-full p-5 rounded-2xl font-black uppercase tracking-[0.35em] text-[11px] transition shadow-[0_20px_50px_rgba(0,0,0,0.6)]
              ${
                loading
                  ? "bg-black/60 text-white/50 cursor-not-allowed"
                  : "bg-black text-white hover:bg-brand-success hover:text-black active:scale-[0.97]"
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