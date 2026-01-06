import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendRegistrationMail } from "@/lib/mailer";

export async function fulfillOrder(registrationId: string) {
  // 1. Call the Database Function (RPC)
  // Status update aur BIB assignment ko handle karta hai
  const { data: bibData, error: rpcError } = await supabaseAdmin.rpc(
    "assign_bibs_atomic",
    { reg_id: registrationId }
  );

  if (rpcError) {
    console.error("RPC Error:", rpcError);
    return { success: false };
  }

  // Idempotency check: Agar pehle se paid hai toh bibData khali aayega
  if (!bibData || bibData.length === 0) {
    console.log("Order already fulfilled or no participants found.");
    return { success: true };
  }

  // 2. Fetch Details (User, Category aur Event Name dynamic nikalne ke liye)
  const { data: reg, error: fetchErr } = await supabaseAdmin
    .from("registrations")
    .select(
      `
      user_id, 
      events ( name ),
      categories:categories!registrations_category_id_fkey ( name )
    `
    )
    .eq("id", registrationId)
    .single();

  if (fetchErr || !reg) {
    console.error("Fetch Reg Error:", fetchErr);
    return { success: false };
  }

  // 3. Handle Join Data Structure (Object vs Array check)
  const categoryData: any = reg.categories;
  const categoryName = Array.isArray(categoryData)
    ? categoryData[0]?.name
    : categoryData?.name;

  const eventData: any = reg.events;
  const eventName = Array.isArray(eventData)
    ? eventData[0]?.name
    : eventData?.name || "FYTRR RUN 2026";

  // 4. Get User Email from Auth
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
    reg.user_id
  );

  // 5. Send Confirmation Email
  if (userData?.user?.email) {
    try {
      // BIB format: Participant Name: BIB (e.g., Sultan: A-101)
      const bibString = bibData
        .map((b: any) => `<strong>${b.p_name}</strong>: ${b.p_bib}`)
        .join("<br/>");

      await sendRegistrationMail({
        to: userData.user.email,
        name: "Athlete",
        event: eventName,
        category: categoryName || "Race Category",
        bib: bibString,
      });

      console.log(`Success: Email sent to ${userData.user.email}`);
    } catch (mailErr) {
      // DB update ho chuka hai, isliye email fail hone par bhi false return nahi karenge
      console.error("Email failed but DB is updated:", mailErr);
    }
  }

  return { success: true };
}
