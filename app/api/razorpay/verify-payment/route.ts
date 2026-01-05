import crypto from "crypto";
import { NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfillment";

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

    // 2. Delegate Fulfillment to the Unified Helper
    // This helper calls the atomic SQL function to assign BIBs safely
    const result = await fulfillOrder(registration_id);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Payment verified but BIB assignment failed" },
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
