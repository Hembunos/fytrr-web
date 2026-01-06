import crypto from "crypto";
import { NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfillment";
import { createSupabaseServer } from "@/lib/supabase/server"; // Added for direct table access

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

    // ... existing imports and signature check

    const supabase = await createSupabaseServer();

    // 1. Fetch registration details with category price and participant count
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

    // 2. Calculate Total Amount
    const unitPrice = regData?.categories?.price || 0;
    const participantCount = regData?.participants?.length || 1;
    const totalAmount = unitPrice * participantCount;

    // 3. Insert into Payments Table with calculated amount
    const { error: payError } = await supabase.from("payments").insert({
      registration_id: registration_id,
      razorpay_payment_id: razorpay_payment_id,
      // razorpay_order_id: razorpay_order_id,
      amount: totalAmount, // Ab ye NULL nahi jayega
      status: "success",
    });

    // ... rest of the fulfillOrder logic
    if (payError) {
      console.error("Payment Record Error:", payError);
      // Agar payment record nahi bana, toh aage nahi badhna chahiye
      return NextResponse.json(
        { error: "Failed to record payment" },
        { status: 500 }
      );
    }

    // 3. Delegate Fulfillment (Status update & BIB assignment)
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
