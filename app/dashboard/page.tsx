import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Suspense } from "react";
import SuccessToast from "@/components/SuccessToast"; // We will create this below
import Link from "next/link";

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
    <div className="p-6 max-w-4xl mx-auto space-y-10 mb-20">
      {/* Success Toast for post-payment redirect */}
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>

      {/* Dashboard Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          My <span className="text-zinc-400">Registrations</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
          Manage your entries and track your BIB status
        </p>
      </div>

      {!registrations || registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 rounded-[2.5rem] bg-zinc-50 space-y-4">
          <p className="text-zinc-400 font-bold italic uppercase tracking-widest text-sm">
            No active race entries found
          </p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
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
                className="group relative border-2 border-zinc-100 rounded-[2rem] p-8 shadow-sm bg-white hover:border-black transition-all duration-500"
              >
                {/* Status Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isPaid
                            ? "bg-green-500 animate-pulse"
                            : "bg-yellow-500"
                        }`}
                      />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                        Registration Confirmed
                      </p>
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black">
                      {event?.name}{" "}
                      <span className="text-zinc-300 mx-2">/</span>{" "}
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">
                      Registered on{" "}
                      {new Date(reg.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                    <p className="text-2xl font-black italic tracking-tighter">
                      ₹{totalAmount}
                    </p>
                    <span
                      className={`text-[9px] uppercase font-black px-3 py-1 rounded-full tracking-widest ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                </div>

                {/* Participant BIB Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-zinc-50 border border-zinc-100 p-4 rounded-2xl group-hover:bg-white group-hover:border-zinc-200 transition-all"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest">
                          Athlete
                        </p>
                        <p className="text-sm font-black uppercase italic text-zinc-800">
                          {p.participant_name}
                        </p>
                      </div>

                      {isPaid && p.bib_number ? (
                        <div className="text-right">
                          <p className="text-[8px] uppercase font-bold text-zinc-500 tracking-widest mb-1 text-center">
                            BIB Number
                          </p>
                          <span className="font-black text-xs px-3 py-2 rounded-xl bg-black text-white block shadow-lg shadow-zinc-200">
                            {category.bib_prefix}-{p.bib_number}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-[9px] text-zinc-400 font-bold uppercase italic tracking-tighter">
                            {isPaid ? "Generating..." : "Awaiting Payment"}
                          </span>
                        </div>
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
