import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { registration_id } = await req.json();

    if (!registration_id) {
      return NextResponse.json(
        { error: "Missing registration_id" },
        { status: 400 }
      );
    }

    /* 🔐 AUTH */
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 📦 FETCH REGISTRATION + CATEGORY + PARTICIPANTS */
    const { data: registration, error } = await supabase
      .from("registrations")
      .select(
        `
        id,
        status,
        categories!inner (
          price
        ),
        participants (
          id
        )
      `
      )
      .eq("id", registration_id)
      .eq("user_id", user.id)
      .single();

    if (error || !registration) {
      console.error("Registration fetch error:", error);
      return NextResponse.json(
        { error: "Invalid registration" },
        { status: 400 }
      );
    }

    /* 🛑 ALREADY PAID = DO NOT CREATE NEW ORDER */
    if (registration.status === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    const price = registration.categories.price;
    const participantCount = registration.participants.length;

    if (!price || participantCount === 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const totalAmount = price * participantCount;

    /* 💳 RAZORPAY ORDER */
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `reg_${registration_id}`,
      notes: {
        registration_id,
        user_id: user.id,
      },
    });

    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
