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
    if (!userId || !categoryData || loading) return;
    if (cleanedNames.length === 0) return alert("Add at least one participant");

    setLoading(true);

    try {
      // Create Pending Registration
      const { data: registration, error: regError } = await supabase
        .from("registrations")
        .insert({
          user_id: userId,
          category_id: categoryId,
          event_id: categoryData.event_id,
          status: "pending", // Default from schema
        })
        .select()
        .single();

      if (regError || !registration) throw new Error("Registration failed");

      // Add Participants
      const { error: partError } = await supabase.from("participants").insert(
        cleanedNames.map((name) => ({
          registration_id: registration.id,
          participant_name: name.trim(),
        }))
      );

      if (partError) throw new Error("Failed to add participants");

      // Trigger Checkout from Utility
      const { handlePayment } = await import("@/lib/checkout");
      await handlePayment(registration.id);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {categoryData?.name || "Register"}
        </h1>
        <p className="text-zinc-500 text-sm">Fill in the athlete names below</p>
      </div>

      <div className="space-y-3">
        {participants.map((name, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-black outline-none"
              placeholder={`Athlete ${index + 1} Full Name`}
              value={name}
              onChange={(e) => {
                const updated = [...participants];
                updated[index] = e.target.value;
                setParticipants(updated);
              }}
            />
            {participants.length > 1 && (
              <button
                onClick={() =>
                  setParticipants(participants.filter((_, i) => i !== index))
                }
                className="text-red-500 px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="text-sm font-semibold text-zinc-600 hover:text-black transition-colors"
        onClick={() => setParticipants([...participants, ""])}
      >
        + Add Another Athlete
      </button>

      <div className="bg-zinc-50 p-4 rounded-xl border">
        <div className="flex justify-between text-sm">
          <span>
            {categoryData?.name} x {cleanedNames.length}
          </span>
          <span className="font-bold">₹{totalAmount}</span>
        </div>
      </div>

      <button
        className="bg-black text-white p-3 rounded-xl w-full font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all"
        disabled={loading || cleanedNames.length === 0}
        onClick={handleRegister}
      >
        {loading ? "Initializing..." : `Pay ₹${totalAmount}`}
      </button>
    </div>
  );
}
