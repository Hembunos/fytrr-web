import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  /* 🔐 AUTH CHECK */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  /* 📦 FETCH REGISTRATIONS */
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select(
      `
    id,
    status,
    created_at,
    events (
      name
    ),
    categories:categories!registrations_category_id_fkey (
      name,
      price,
      bib_prefix
    ),
    participants (
      id,
      participant_name,
      bib_number
    )
  `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-6">Failed to load registrations</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Registrations</h1>

      {registrations.length === 0 ? (
        <p className="text-zinc-500">No registrations yet</p>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const price = reg.categories?.[0]?.price ?? 0;
            const bibPrefix = reg.categories?.[0]?.bib_prefix ?? "";
            const totalAmount = price * (reg.participants?.length ?? 0);

            return (
              <div key={reg.id} className="border rounded p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {reg.events?.name} • {reg.categories?.[0]?.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{totalAmount}</p>

                    {reg.status === "paid" ? (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-green-700 text-white">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-900">
                        Payment Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t space-y-1">
                  {reg.participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{p.participant_name}</span>

                      {reg.status === "paid" ? (
                        p.bib_number ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-white">
                            BIB {bibPrefix}-{p.bib_number}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-700 text-white">
                            Paid
                          </span>
                        )
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-900">
                          Payment Pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
