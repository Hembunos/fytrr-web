import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendRegistrationMail } from "@/lib/mailer";

export async function POST(req: Request) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    registration_id,
  } = await req.json();

  /* ───────── 1️⃣ VERIFY SIGNATURE ───────── */
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  /* ───────── 2️⃣ FETCH REGISTRATION ───────── */
  const { data: reg, error: regErr } = await supabaseAdmin
    .from("registrations")
    .select("id, user_id, category_id, status")
    .eq("id", registration_id)
    .single();

  if (regErr || !reg) {
    return NextResponse.json(
      { error: "Registration not found" },
      { status: 404 }
    );
  }

  /* 🔐 IDEMPOTENT GUARD */
  if (reg.status === "paid") {
    return NextResponse.json({ success: true });
  }

  /* ───────── 3️⃣ MARK REGISTRATION AS PAID (EARLY) ───────── */
  await supabaseAdmin
    .from("registrations")
    .update({ status: "paid" })
    .eq("id", registration_id);

  /* ───────── 4️⃣ FETCH CATEGORY (OPTIONAL FOR BIB) ───────── */
  const { data: category } = await supabaseAdmin
    .from("categories")
    .select("name, price, bib_prefix")
    .eq("id", reg.category_id)
    .single();

  /* ───────── 5️⃣ FETCH PARTICIPANTS ───────── */
  const { data: participants } = await supabaseAdmin
    .from("participants")
    .select("id, participant_name, bib_number")
    .eq("registration_id", registration_id)
    .order("created_at");

  const bibList: { name: string; bib?: string }[] = [];

  /* ───────── 6️⃣ ASSIGN BIB (ONLY IF PREFIX EXISTS) ───────── */
  if (category?.bib_prefix && participants && participants.length > 0) {
    const { data: lastBibRow } = await supabaseAdmin
      .from("participants")
      .select(
        `
        bib_number,
        registrations!inner(category_id)
      `
      )
      .eq("registrations.category_id", reg.category_id)
      .not("bib_number", "is", null)
      .order("bib_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    let nextBib = (lastBibRow?.bib_number ?? 100) + 1;

    for (const p of participants) {
      await supabaseAdmin
        .from("participants")
        .update({ bib_number: nextBib })
        .eq("id", p.id);

      bibList.push({
        name: p.participant_name,
        bib: `${category.bib_prefix}-${nextBib}`,
      });

      nextBib++;
    }
  } else if (participants) {
    // No BIB prefix → still success
    for (const p of participants) {
      bibList.push({ name: p.participant_name });
    }
  }

  /* ───────── 7️⃣ INSERT PAYMENT (IDEMPOTENT) ───────── */
  const { data: existingPayment } = await supabaseAdmin
    .from("payments")
    .select("id")
    .eq("razorpay_payment_id", razorpay_payment_id)
    .maybeSingle();

  if (!existingPayment && category) {
    await supabaseAdmin.from("payments").insert({
      registration_id,
      razorpay_payment_id,
      amount: (participants?.length ?? 1) * category.price,
      status: "paid",
    });
  }

  /* ───────── 8️⃣ SEND EMAIL (BEST EFFORT) ───────── */
  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
    reg.user_id
  );

  if (authUser?.user?.email) {
    try {
      await sendRegistrationMail({
        to: authUser.user.email,
        name: "Team Registration",
        event: "FYTRR Event",
        category: category?.name ?? "Event",
        bib:
          bibList.length > 0
            ? bibList
                .map((b) => (b.bib ? `${b.name} – ${b.bib}` : b.name))
                .join("<br/>")
            : "",
      });
    } catch (err) {
      console.error("Email failed:", err);
    }
  }

  /* ───────── ✅ RESPONSE ───────── */
  return NextResponse.json({
    success: true,
    participants: bibList,
  });
}
