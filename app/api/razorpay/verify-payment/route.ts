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

  // 1. Verify Signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Fetch Registration & Category
  const { data: reg, error: regErr } = await supabaseAdmin
    .from("registrations")
    .select(
      `
      id, user_id, status, category_id,
      categories (name, price, bib_prefix)
    `
    )
    .eq("id", registration_id)
    .single();

  if (regErr || !reg) {
    return NextResponse.json(
      { error: "Registration not found" },
      { status: 404 }
    );
  }

  if (reg.status === "paid") return NextResponse.json({ success: true });

  // 3. Update Status to Paid
  await supabaseAdmin
    .from("registrations")
    .update({ status: "paid" })
    .eq("id", registration_id);

  // 4. Fetch Participants for this registration
  const { data: participants } = await supabaseAdmin
    .from("participants")
    .select("id, participant_name")
    .eq("registration_id", registration_id);

  const bibList = [];
  const categoryData = Array.isArray(reg.categories)
    ? reg.categories[0]
    : reg.categories;

  /* ───────── 5. UPDATED CATEGORY-SPECIFIC BIB LOGIC ───────── */
  if (categoryData?.bib_prefix && participants) {
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
      // 1. AWAIT the database update and check for errors
      const { error: dbUpdateError } = await supabaseAdmin
        .from("participants")
        .update({ bib_number: nextBib })
        .eq("id", p.id);

      if (!dbUpdateError) {
        // 2. ONLY add the real BIB to the email list if DB saved it successfully
        bibList.push({
          name: p.participant_name,
          bib: `${categoryData.bib_prefix}-${nextBib}`,
        });
      } else {
        // 3. FALLBACK: If DB fails, don't lie in the email
        console.error(
          `DB Update failed for ${p.participant_name}:`,
          dbUpdateError
        );
        bibList.push({
          name: p.participant_name,
          bib: "Assignment Pending (Contact Support)",
        });
      }

      nextBib++;
    }
  }

  // 6. Record Payment
  await supabaseAdmin.from("payments").upsert({
    registration_id,
    razorpay_payment_id,
    amount: (participants?.length || 1) * (categoryData?.price || 0),
    status: "paid",
  });

  // 7. Send Email
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
    reg.user_id
  );
  if (userData?.user?.email) {
    try {
      await sendRegistrationMail({
        to: userData.user.email,
        name: "Athlete",
        event: "Hyrox Event",
        category: categoryData?.name || "Event",
        bib: bibList.map((b) => `${b.name}: ${b.bib}`).join("<br/>"),
      });
    } catch (e) {
      console.error("Mail error", e);
    }
  }

  return NextResponse.json({ success: true });
}
