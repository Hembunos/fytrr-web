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
    <div className="p-6 max-w-sm mx-auto space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {categoryData?.name || "Register"}
        </h1>
        <p className="text-zinc-500 text-sm">
          Enter the names of the athletes participating
        </p>
      </div>

      <div className="space-y-3">
        {participants.map((name, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-black outline-none transition-all disabled:bg-zinc-100"
              placeholder={`Athlete ${index + 1} Full Name`}
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
                  setParticipants(participants.filter((_, i) => i !== index))
                }
                className="text-red-500 px-2 hover:bg-red-50 rounded-md transition-colors"
                title="Remove Athlete"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {!loading && (
        <button
          type="button"
          className="text-sm font-semibold text-zinc-600 hover:text-black transition-colors"
          onClick={() => setParticipants([...participants, ""])}
        >
          + Add Another Athlete
        </button>
      )}

      <div className="bg-zinc-50 p-4 rounded-xl border">
        <div className="flex justify-between text-sm items-center">
          <span className="text-zinc-600">
            {categoryData?.name || "Total"} (x{cleanedNames.length})
          </span>
          <span className="font-bold text-lg">₹{totalAmount}</span>
        </div>
      </div>

      <button
        className="bg-black text-white p-3 rounded-xl w-full font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
        disabled={loading || cleanedNames.length === 0}
        onClick={handleRegister}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          `Proceed to Pay ₹${totalAmount}`
        )}
      </button>

      <p className="text-[10px] text-zinc-400 text-center">
        By proceeding, you agree to the event terms and conditions.
      </p>
    </div>
  );
}
