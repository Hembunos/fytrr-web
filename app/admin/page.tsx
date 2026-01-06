import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminClientWrapper from "@/components/admin/AdminClientWrapper";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Role Check

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // 2. Fetch Events with Registration & Category counts
  const { data: events } = await supabase
    .from("events")
    .select(
      `
    *,
    categories (*),
    registrations (
      id,
      status,
      participants (id, participant_name, bib_number, rank, finish_time),
      payments (amount, status)
    )
  `
    )
    .order("event_date", { ascending: true });

  // Pass everything to the Client Wrapper for Interactivity
  return <AdminClientWrapper initialEvents={events || []} />;
}
