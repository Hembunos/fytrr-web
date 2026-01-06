import crypto from "crypto";
import { NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfillment";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registration_id,
    } = await req.json();

    // 1. Verify Razorpay Signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();

    // 2. Fetch registration details
    // Note: Supabase sometimes returns categories as an object or array based on schema
    const { data: regData } = await supabase
      .from("registrations")
      .select(
        `
        category_id,
        categories (price),
        participants (id)
      `
      )
      .eq("id", registration_id)
      .single();

    if (!regData) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // 3. FIX: Handle price extraction safely (Array vs Object check)
    const categoryData = regData.categories;
    const unitPrice = Array.isArray(categoryData)
      ? categoryData[0]?.price || 0
      : (categoryData as any)?.price || 0;

    const participantCount = regData.participants?.length || 0;
    const totalAmount = unitPrice * participantCount;

    // 4. Insert into Payments Table
    const { error: payError } = await supabase.from("payments").insert({
      registration_id: registration_id,
      razorpay_payment_id: razorpay_payment_id,
      amount: totalAmount,
      status: "success",
    });

    if (payError) {
      console.error("Payment Record Error:", payError);
      return NextResponse.json(
        { error: "Failed to record payment" },
        { status: 500 }
      );
    }

    // 5. Delegate Fulfillment
    const result = await fulfillOrder(registration_id);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Payment recorded but BIB assignment failed" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Verification Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
