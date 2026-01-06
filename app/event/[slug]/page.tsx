import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import CountdownTimer from "@/components/CountdownTimer";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  // 1. Fetch Event Details
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return notFound();

  // 2. Fetch Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header with Countdown */}
      <div className="bg-black text-white py-24 px-6 relative overflow-hidden">
        {/* Subtle Background Text */}
        <div className="absolute top-0 right-0 text-[15rem] font-black italic opacity-5 select-none pointer-events-none translate-x-20 -translate-y-20 uppercase">
          {event.name.split(" ")[0]}
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="space-y-6 text-center lg:text-left max-w-2xl">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="px-2 py-1 bg-zinc-800 text-white rounded italic">
                Registration Open
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.location}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
              {event.name}
            </h1>
          </div>

          {/* Integrated Countdown Card */}
          <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
            <p className="text-[10px] uppercase font-bold text-zinc-500 mb-4 text-center tracking-[0.3em]">
              The Countdown Begins
            </p>
            <CountdownTimer targetDate={event.event_date} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Category Selection */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Choose Your Battle
              </h2>
              <div className="h-[2px] flex-grow bg-zinc-100" />
            </div>

            <div className="grid gap-6">
              {categories?.map((cat) => (
                <div
                  key={cat.id}
                  className="group relative bg-white border-2 border-zinc-100 p-8 rounded-[2.5rem] hover:border-black transition-all shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight">
                          {cat.name}
                        </h3>
                        {cat.price > 1000 && (
                          <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                            Elite
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-sm font-medium">
                        Official Finisher Medal, Timing BIB & Refreshments
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center">
                      <p className="text-3xl font-black italic tracking-tighter">
                        ₹{cat.price}
                      </p>
                      <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">
                        Limited Slots Left
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/register?category=${cat.id}`}
                    className="block mt-8 text-center bg-black text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-800 transition-all active:scale-[0.97] shadow-lg shadow-zinc-200"
                  >
                    Select & Continue
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 space-y-6 sticky top-24">
              <h4 className="font-black uppercase text-xs italic tracking-[0.3em] text-zinc-400">
                Essential Details
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Race Day", value: "Feb 15, 2026", icon: "📅" },
                  { label: "Flag Off", value: "05:30 AM IST", icon: "🏁" },
                  { label: "Location", value: "Dumka, JH", icon: "📍" },
                  { label: "BIB Range", value: "B-101 Onwards", icon: "🏃" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-zinc-500 font-medium flex items-center gap-2">
                      <span className="grayscale">{item.icon}</span>{" "}
                      {item.label}
                    </span>
                    <span className="font-bold uppercase tracking-tight">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-zinc-200">
                <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-4 border border-green-100">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-green-700 tracking-widest">
                      Status: Live
                    </p>
                    <p className="text-[9px] text-green-600 font-bold uppercase mt-0.5">
                      Registration is actively flowing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
