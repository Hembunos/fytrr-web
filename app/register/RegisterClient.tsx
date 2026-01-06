"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

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
    // PREVENT DOUBLE CLICK: Immediate exit if already loading
    if (!userId || !categoryData || loading) return;

    if (cleanedNames.length === 0) {
      alert("Please add at least one participant name.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Pending Registration
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

      // 2. Add Participants to the database
      const { error: partError } = await supabase.from("participants").insert(
        cleanedNames.map((name) => ({
          registration_id: registration.id,
          participant_name: name.trim(),
        }))
      );

      if (partError) throw new Error("Failed to save participant details.");

      // 3. Trigger Razorpay Checkout
      // Importing handlePayment dynamically to keep the initial bundle small
      const { handlePayment } = await import("@/lib/checkout");

      // Pass a callback to reset loading if the user cancels the popup
      await handlePayment(registration.id, () => setLoading(false));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false); // Reset loading so they can try again
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto space-y-8 bg-white shadow-2xl rounded-[2.5rem] border border-zinc-100 mt-10 mb-20">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          <span className="px-2 py-0.5 bg-zinc-100 rounded italic">
            Step 02
          </span>
          <span>•</span>
          <span>Athlete Details</span>
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          {categoryData?.name || "Register"}
        </h1>
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide">
          Enter names exactly as they should appear on the BIB
        </p>
      </div>

      {/* Athlete Inputs */}
      <div className="space-y-4">
        {participants.map((name, index) => (
          <div key={index} className="group relative flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">
              Athlete {index + 1}
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  className="w-full border-2 border-zinc-100 rounded-2xl p-4 focus:border-black outline-none transition-all disabled:bg-zinc-50 font-bold placeholder:font-normal placeholder:text-zinc-300"
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
                    setParticipants(participants.filter((_, i) => i !== index))
                  }
                  className="bg-red-50 text-red-500 px-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all group-hover:opacity-100 md:opacity-0"
                  title="Remove Athlete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        {!loading && (
          <button
            type="button"
            className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors py-2"
            onClick={() => setParticipants([...participants, ""])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add Another Athlete
          </button>
        )}
      </div>

      {/* Price Breakdown Card */}
      <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl space-y-3">
        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-zinc-500">
          <span>Description</span>
          <span>Amount</span>
        </div>
        <div className="h-[1px] bg-zinc-800" />
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <p className="text-sm font-bold uppercase tracking-tight italic">
              {categoryData?.name || "Entry Fee"}
            </p>
            <p className="text-[10px] text-zinc-500">
              x{cleanedNames.length} Participant(s)
            </p>
          </div>
          <span className="text-2xl font-black italic tracking-tighter">
            ₹{totalAmount}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-4">
        <button
          className="group relative bg-black text-white p-5 rounded-2xl w-full font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] overflow-hidden"
          disabled={loading || cleanedNames.length === 0}
          onClick={handleRegister}
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Securely...
              </>
            ) : (
              <>
                Pay Now
                <svg
                  className="group-hover:translate-x-1 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </div>
        </button>

        <div className="flex items-center justify-center gap-2">
          <svg
            className="text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
          <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest">
            Secure Razorpay Encrypted Checkout
          </p>
        </div>
      </div>
    </div>
  );
}
