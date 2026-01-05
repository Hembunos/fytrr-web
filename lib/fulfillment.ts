import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendRegistrationMail } from "@/lib/mailer";

export async function fulfillOrder(registrationId: string) {
  // 1. Call the Database Function (RPC)
  // This handles the status update and BIB assignment atomically
  const { data: bibData, error: rpcError } = await supabaseAdmin.rpc(
    "assign_bibs_atomic",
    { reg_id: registrationId }
  );

  if (rpcError) {
    console.error("RPC Error:", rpcError);
    return { success: false };
  }

  // Idempotency: If bibData is empty, it means the RPC already ran once
  // and the status was already 'paid'
  if (!bibData || bibData.length === 0) {
    console.log("Order already fulfilled or no participants found.");
    return { success: true };
  }

  // 2. Fetch User Email & Category Name
  // We explicitly select the category via the foreign key link
  const { data: reg, error: fetchErr } = await supabaseAdmin
    .from("registrations")
    .select(
      `
      user_id, 
      categories:categories!registrations_category_id_fkey ( name )
    `
    )
    .eq("id", registrationId)
    .single();

  if (fetchErr || !reg) {
    console.error("Fetch Reg Error:", fetchErr);
    return { success: false };
  }

  // Handle Supabase join data structure (could be object or array)
  const categoryData: any = reg.categories;
  const categoryName = Array.isArray(categoryData)
    ? categoryData[0]?.name
    : categoryData?.name;

  // 3. Get the User's Email from Auth
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
    reg.user_id
  );

  // 4. Send Confirmation Email
  if (userData?.user?.email) {
    try {
      // Format the BIB strings returned from the SQL function
      const bibString = bibData
        .map((b: any) => `<strong>${b.p_name}</strong>: ${b.p_bib}`)
        .join("<br/>");

      await sendRegistrationMail({
        to: userData.user.email,
        name: "Athlete",
        event: "Fytrr Run 2026",
        category: categoryName || "Registration",
        bib: bibString,
      });

      console.log(`Success: Email sent to ${userData.user.email}`);
    } catch (mailErr) {
      // We don't return false here because the DB is already updated
      console.error("Email failed but DB is updated:", mailErr);
    }
  }

  return { success: true };
}
