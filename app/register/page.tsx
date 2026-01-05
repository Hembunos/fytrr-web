"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RegisterPage() {
  const params = useSearchParams();
  const categoryId = params.get("category");

  const [userId, setUserId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [categoryName, setCategoryName] = useState("");

  /* ───────── AUTH CHECK ───────── */
  useEffect(() => {
    if (!categoryId) {
      window.location.href = "/";
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.replace(
          "/login?redirectTo=" +
            encodeURIComponent(`/register?category=${categoryId}`)
        );
      } else {
        setUserId(data.user.id);
      }
    });
  }, [categoryId]);

  /* ───────── FETCH CATEGORY ───────── */
  useEffect(() => {
    if (!categoryId) return;

    supabase
      .from("categories")
      .select("price, name")
      .eq("id", categoryId)
      .single()
      .then(({ data }) => {
        if (data) {
          setPrice(data.price);
          setCategoryName(data.name);
        }
      });
  }, [categoryId]);

  const cleanedParticipants = useMemo(
    () => participants.map((p) => p.trim()).filter(Boolean),
    [participants]
  );

  const totalAmount = price * cleanedParticipants.length;

  /* ───────── REGISTER HANDLER ───────── */
  async function handleRegister() {
    if (!userId || loading) return;

    if (participants.some((p) => !p.trim())) {
      alert("Please fill all participant names");
      return;
    }

    if (cleanedParticipants.length === 0) {
      alert("Add at least one participant");
      return;
    }

    setLoading(true);

    try {
      /* 1️⃣ Fetch category */
      const { data: category, error: catError } = await supabase
        .from("categories")
        .select("id, event_id")
        .eq("id", categoryId)
        .single();

      if (catError || !category) {
        alert("Invalid category");
        return;
      }

      /* 2️⃣ Create registration (PAYMENT PENDING) */
      const { data: registration, error: regError } = await supabase
        .from("registrations")
        .insert({
          user_id: userId,
          category_id: categoryId,
          event_id: category.event_id,
          status: "payment_pending", // ✅ FIXED
        })
        .select()
        .single();

      if (regError || !registration) {
        alert("Failed to create registration");
        return;
      }

      /* 3️⃣ Insert participants */
      const { error: partError } = await supabase.from("participants").insert(
        cleanedParticipants.map((name) => ({
          registration_id: registration.id,
          participant_name: name,
        }))
      );

      if (partError) {
        alert("Failed to add participants");
        return;
      }

      /* 4️⃣ Create Razorpay order (NO AMOUNT FROM FRONTEND) */
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: registration.id,
        }),
      });

      const order = await orderRes.json();

      if (!order?.id) {
        alert("Payment initialization failed");
        return;
      }

      /* 5️⃣ Open Razorpay */
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "FYTRR Event",
        description: `${cleanedParticipants.length} participants • ${categoryName}`,
        order_id: order.id,

        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              registration_id: registration.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await verifyRes.json();

          if (!result.success) {
            alert("Payment verification failed");
            return;
          }

          alert("🎉 Registration successful!");
          window.location.href = "/dashboard";
        },

        modal: {
          ondismiss: () => alert("Payment cancelled"),
        },

        theme: { color: "#000000" },
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* ───────── UI ───────── */
  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Register</h1>

      {participants.map((name, index) => (
        <input
          key={index}
          className="border p-2 w-full mb-2"
          placeholder={`Participant ${index + 1} Name`}
          value={name}
          onChange={(e) => {
            const updated = [...participants];
            updated[index] = e.target.value;
            setParticipants(updated);
          }}
        />
      ))}

      <button
        type="button"
        className="text-sm text-blue-500 mb-4"
        onClick={() => {
          if (participants.some((p) => !p.trim())) {
            alert("Please fill the empty participant name first");
            return;
          }
          setParticipants([...participants, ""]);
        }}
      >
        + Add another participant
      </button>

      {cleanedParticipants.length > 0 && (
        <div className="mb-3 text-sm text-zinc-600">
          <div>
            Total Participants: <b>{cleanedParticipants.length}</b>
          </div>
          <div>
            Total Amount: <b>₹{totalAmount}</b>
          </div>
        </div>
      )}

      <button
        className="bg-black text-white p-2 w-full"
        disabled={loading || cleanedParticipants.length === 0}
        onClick={handleRegister}
      >
        {loading ? "Processing..." : "Confirm Registration"}
      </button>
    </div>
  );
}
