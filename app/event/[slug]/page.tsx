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

  // 1. Fetch Event & Categories
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Hero Header with Countdown */}
      <div className="bg-black text-white py-32 px-6 relative overflow-hidden">
        {/* Subtle Background Text */}
        <div className="absolute top-0 right-0 text-[20rem] font-black italic opacity-[0.03] select-none pointer-events-none translate-x-1/4 -translate-y-1/4 uppercase leading-none">
          {event.name.split(" ")[0]}
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-16 relative z-10">
          <div className="space-y-8 text-center lg:text-left max-w-2xl">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">
              <span className="px-3 py-1.5 bg-zinc-800 text-white rounded-full italic animate-pulse">
                Registration Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                📍 {event.location}
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] animate-in fade-in slide-in-from-left-8 duration-700">
              {event.name}
            </h1>
          </div>

          {/* Integrated Countdown Card */}
          <div className="bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-zinc-800 shadow-2xl scale-110 lg:scale-100">
            <p className="text-[10px] uppercase font-black text-zinc-600 mb-6 text-center tracking-[0.4em]">
              Battle Commences In
            </p>
            <CountdownTimer targetDate={event.event_date} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Category Selection */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                The <span className="text-zinc-300">Categories</span>
              </h2>
              <div className="h-1.5 w-24 bg-black" />
            </div>

            <div className="grid gap-8">
              {categories?.map((cat) => (
                <div
                  key={cat.id}
                  className={`group relative p-10 rounded-[3rem] border-2 transition-all duration-500 ${
                    cat.price > 1000
                      ? "bg-zinc-950 text-white border-zinc-800 hover:border-white shadow-2xl"
                      : "bg-white text-black border-zinc-100 hover:border-black"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-black uppercase italic tracking-tight">
                          {cat.name}
                        </h3>
                        {cat.price > 1000 && (
                          <span className="text-[9px] bg-white text-black px-3 py-1 rounded-full font-black uppercase tracking-widest italic">
                            PRO ELITE
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm font-medium ${
                          cat.price > 1000 ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        Official Finisher Medal • High-Performance BIB •
                        Refreshments
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between">
                      <p className="text-4xl font-black italic tracking-tighter">
                        ₹{cat.price}
                      </p>
                      <p
                        className={`text-[10px] uppercase font-black tracking-widest mt-1 ${
                          cat.price > 1000 ? "text-zinc-600" : "text-zinc-300"
                        }`}
                      >
                        Slots Filling Fast
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/register?category=${cat.id}`}
                    className={`block mt-10 text-center py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-[0.98] ${
                      cat.price > 1000
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-black text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200"
                    }`}
                  >
                    Claim Your Spot
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-50 p-10 rounded-[3rem] border border-zinc-100 space-y-8 sticky top-24 transition-all hover:shadow-xl">
              <h4 className="font-black uppercase text-[10px] italic tracking-[0.4em] text-zinc-400">
                Race Intel
              </h4>
              <ul className="space-y-6">
                {[
                  {
                    label: "Race Day",
                    value: new Date(event.event_date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    ),
                    icon: "⚡",
                  },
                  { label: "Flag Off", value: "05:30 AM", icon: "🏁" },
                  { label: "Timing", value: "Verified Chip", icon: "⏱️" },
                  {
                    label: "BIB Range",
                    value: `${categories?.[0]?.bib_prefix || "A"}-101 +`,
                    icon: "🏃",
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="text-zinc-500 font-bold flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span> {item.label}
                    </span>
                    <span className="font-black uppercase tracking-tight text-black">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-8 border-t border-zinc-200">
                <div className="bg-white p-6 rounded-3xl border border-zinc-200 flex items-center gap-5">
                  <div className="relative">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-ping absolute inset-0" />
                    <div className="h-3 w-3 bg-green-500 rounded-full relative" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-black tracking-widest">
                      Live Fulfillment
                    </p>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">
                      BIBs generated instantly
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
