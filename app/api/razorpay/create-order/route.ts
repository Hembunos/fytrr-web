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

    // 🔐 Auth
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📦 Registration + price
    const { data: registration, error } = await supabase
      .from("registrations")
      .select(
        `
        id,
        status,
        categories (
          price
        )
      `
      )
      .eq("id", registration_id)
      .eq("user_id", user.id)
      .single();

    if (error || !registration) {
      return NextResponse.json(
        { error: "Invalid registration" },
        { status: 400 }
      );
    }

    if (registration.status === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    const amount = registration.categories?.price;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 💳 Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: registration_id,
    });

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
