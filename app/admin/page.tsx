import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = user.user_metadata?.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl">Admin Dashboard</h1>
    </div>
  );
}
