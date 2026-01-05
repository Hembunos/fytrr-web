import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Suspense } from "react";
import SuccessToast from "@/components/SuccessToast"; // We will create this below

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  /* 🔐 AUTH CHECK (Server Side) */
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
      events ( name ),
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
    return (
      <div className="p-6 text-red-500 font-bold">
        Failed to load registrations
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Client-side success message handled via Suspense boundary */}
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>

      <h1 className="text-2xl font-semibold mb-6">My Registrations</h1>

      {!registrations || registrations.length === 0 ? (
        <p className="text-zinc-500 bg-zinc-50 p-8 text-center rounded-xl border border-dashed">
          No registrations yet
        </p>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const category = Array.isArray(reg.categories)
              ? reg.categories[0]
              : reg.categories;
            const event = Array.isArray(reg.events)
              ? reg.events[0]
              : reg.events;
            const participants = reg.participants || [];

            if (!category || participants.length === 0) return null;

            const totalAmount = category.price * participants.length;
            const isPaid = reg.status === "paid";

            return (
              <div
                key={reg.id}
                className="border rounded-xl p-5 shadow-sm bg-white space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-zinc-900">
                      {event?.name} • {category.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(reg.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-zinc-900">₹{totalAmount}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg text-sm"
                    >
                      <span className="font-medium text-zinc-700">
                        {p.participant_name}
                      </span>
                      {isPaid && p.bib_number ? (
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-zinc-900 text-white">
                          BIB {category.bib_prefix}-{p.bib_number}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-400 italic">
                          {isPaid ? "Assigning BIB..." : "Payment Pending"}
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
