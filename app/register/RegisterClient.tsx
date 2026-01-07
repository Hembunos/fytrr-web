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

      {/* ⬛ Stealth Header Strip: Bottom Aligned */}
      <div className="relative w-full h-[350px] md:h-[450px] bg-[#050505] flex items-end pb-16 md:pb-24 overflow-hidden border-b border-white/5">
        {/* Background Giant Text */}
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
          <div className="text-[18rem] md:text-[30rem] font-black italic uppercase leading-none text-white tracking-tighter -rotate-6">
            {categoryData?.name?.split(" ")[0] || "GO"}
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-brand-success text-black rounded-full italic text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                ● Official Entry
              </span>
              <span className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px] italic border-l border-white/10 pl-4">
                Protocol v1.0
              </span>
            </div>

            <h1 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-[0.8] text-white animate-in fade-in slide-in-from-left-8 duration-700">
              {categoryData?.name || "Register"}
            </h1>
          </div>
        </div>
      </div>

      {/* 🏁 Floating Registration Card: Optimized Spacing */}
      <div className="relative z-20 flex flex-col items-center px-4 md:px-6 -mt-10 md:-mt-16 pb-24">
        <div className="w-full max-w-lg p-6 md:p-12 space-y-10 md:space-y-12 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-[2.5rem] border-t-[8px] border-black animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {/* Step Indicator Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-black/40 italic">
              <span className="px-3 py-1 bg-black text-white rounded italic">
                Step 02
              </span>
              <span>•</span>
              <span className="text-brand-success font-black uppercase tracking-widest">
                Athlete Details
              </span>
            </div>
            <p className="text-black/60 text-[11px] font-black uppercase tracking-widest leading-relaxed border-l-2 border-black/10 pl-4 italic">
              Enter names exactly as they should appear on the official BIB
            </p>
          </div>

          {/* Athlete Inputs Section */}
          <div className="space-y-6 md:space-y-8">
            {participants.map((name, index) => (
              <div key={index} className="group relative flex flex-col gap-3">
                <label className="text-[9px] uppercase font-black text-black/30 ml-2 tracking-widest group-focus-within:text-black transition-colors">
                  Athlete {index + 1}
                </label>
                <div className="flex gap-2 md:gap-4">
                  <div className="relative flex-1">
                    <input
                      className="w-full border-2 border-black/[0.05] rounded-2xl p-4 md:p-5 bg-[#fcfcfc] text-black focus:bg-white focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all disabled:opacity-50 font-black italic uppercase text-sm shadow-sm placeholder:text-black/20"
                      placeholder="Full Name"
                      value={name}
                      disabled={loading}
                      onChange={(e) => {
                        const updated = [...participants];
                        updated[index] = e.target.value;
                        setParticipants(updated);
                      }}
                    />
                  </div>
                  {participants.length > 1 && !loading && (
                    <button
                      onClick={() =>
                        setParticipants(
                          participants.filter((_, i) => i !== index)
                        )
                      }
                      className="bg-red-50 text-red-500 px-4 md:px-6 rounded-2xl hover:bg-black hover:text-white transition-all active:scale-90 border border-red-100"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {!loading && (
              <button
                type="button"
                className="flex items-center gap-3 px-2 text-[10px] font-black uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors py-2 group"
                onClick={() => setParticipants([...participants, ""])}
              >
                <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                Add Athlete
              </button>
            )}
          </div>

          {/* Black Card: Price Summary */}
          <div className="bg-black text-white p-6 md:p-8 rounded-[2rem] shadow-2xl space-y-5 transform hover:scale-[1.01] transition-transform">
            <div className="flex justify-between text-[9px] uppercase font-black tracking-[0.4em] opacity-40">
              <span>Entry Summary</span>
              <span>Subtotal</span>
            </div>
            <div className="h-[1px] bg-white/10" />
            <div className="flex justify-between items-center gap-4">
              <div className="space-y-1">
                <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter truncate max-w-[150px] md:max-w-none">
                  {categoryData?.name}
                </p>
                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                  {cleanedNames.length} Registered Athlete(s)
                </p>
              </div>
              <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-brand-success">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            className={`group relative p-5 md:p-6 rounded-2xl w-full font-black uppercase tracking-[0.4em] text-[10px] md:text-xs transition-all shadow-xl
          ${
            loading || participants.filter((n) => n.trim() !== "").length === 0
              ? "bg-black/60 text-white/50 cursor-not-allowed"
              : "bg-black text-white hover:bg-brand-success hover:text-black active:scale-[0.98]"
          }`}
            disabled={loading}
            onClick={handleRegister}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? "Securing Spot..." : "Proceed to Payment"}
              {!loading && (
                <svg
                  className="group-hover:translate-x-2 transition-transform duration-300"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}