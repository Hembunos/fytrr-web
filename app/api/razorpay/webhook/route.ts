import { NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillOrder } from "@/lib/fulfillment";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // 1. Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook Signature Mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    // 2. Handle Payment Events
    // 'order.paid' is the most reliable event for order-based checkouts
    if (event === "order.paid" || event === "payment.captured") {
      /* ───────── FIXED PAYLOAD EXTRACTION ───────── */
      // Razorpay payloads vary. We check both payment and order entities for our notes.
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const registrationId =
        paymentEntity?.notes?.registration_id ||
        orderEntity?.notes?.registration_id;

      if (registrationId) {
        console.log(
          `Webhook: Processing fulfillment for Reg: ${registrationId}`
        );
        await fulfillOrder(registrationId);
      } else {
        console.warn("Webhook received but no registration_id found in notes.");
      }
    }

    // Always return 200 to Razorpay quickly to stop retries
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook Processing Error:", err.message);
    // Still return 200 if it's a JSON parsing error so Razorpay doesn't spam retries
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}
