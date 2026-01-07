import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Suspense } from "react";
import SuccessToast from "@/components/SuccessToast";
import Link from "next/link";
import { RegistrationCard } from "@/components/dashboard/RegistrationCard";
import { EmptyTrackView } from "@/components/dashboard/EmptyTrackView";
import { LayoutDashboard } from "lucide-react";

// 1. Updated Interface: Events must be an array to match Supabase join logic
interface Registration {
  id: string;
  status: string;
  created_at: string;
  events: {
    name: string;
    slug: string;
  }[]; // Relationship queries in Supabase always return arrays
  categories: {
    name: string;
    price: number;
    bib_prefix: string;
  };
  participants: {
    id: string;
    participant_name: string;
    bib_number: string | null;
  }[];
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  /* 🔐 AUTH CHECK */
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  /* 👮 JWT ROLE CHECK */
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  /* 📦 FETCH REGISTRATIONS */
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select(
      `
      id,
      status,
      created_at,
      events ( name, slug ),
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
    return (
      <div className="min-h-[60vh] bg-black flex flex-col items-center justify-center p-12 text-center space-y-6">
        <p className="text-brand-danger font-black uppercase italic text-xl tracking-tighter">
          System Sync Error
        </p>
        <Link
          href="/dashboard"
          className="text-[10px] text-white font-black uppercase border-b-2 border-brand-success pb-1"
        >
          Refresh Dashboard
        </Link>
      </div>
    );
  }

  const paidCount =
    registrations?.filter((r) => r.status === "paid").length || 0;

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans selection:bg-brand-success selection:text-black overflow-x-hidden">
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>

      {/* ⬛ HERO SECTION */}
      <div className="relative w-full h-[360px] md:h-[420px] bg-[#050505] flex items-end pb-12 md:pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center">
          <div className="text-[18rem] md:text-[30rem] font-black italic uppercase leading-none text-white tracking-tighter -rotate-6">
            ATHLETE
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-20">
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-brand-success text-black rounded-full italic text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                  ● {isAdmin ? "Admin Profile" : "Live Profile"}
                </span>
                <span className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px] italic border-l border-white/10 pl-4">
                  FYTRR Protocol v1.0
                </span>
              </div>

              <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white">
                MY <br />
                <span
                  className="drop-shadow-sm opacity-20"
                  style={{
                    WebkitTextStroke: "2px white",
                    color: "transparent",
                  }}
                >
                  TRACK
                </span>
              </h1>

              <p className="text-brand-success/60 text-xs font-black uppercase tracking-[0.4em] max-w-sm border-l-2 border-brand-success pl-6 italic">
                Performance Intelligence & <br /> Race Identity Management
              </p>
            </div>

            {isAdmin && (
              <div className="pb-2 md:pb-4 relative z-30">
                <Link
                  href="/admin"
                  className="group flex items-center gap-3 bg-white text-black px-8 py-4 md:py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-success transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-95 border-2 border-transparent"
                >
                  <LayoutDashboard
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Admin Control Center
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🏁 CONTENT OVERLAY */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 -mt-10 md:-mt-12 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] transform hover:-translate-y-2 transition-all duration-500 group">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-success transition-colors italic">
              Total Deployments
            </p>
            <p className="text-6xl font-black italic text-black leading-none">
              {registrations?.length.toString().padStart(2, "0") || "00"}
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] transform hover:-translate-y-2 transition-all duration-500 border-b-8 border-brand-success/5">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 italic">
              Verified BIBs
            </p>
            <p className="text-6xl font-black italic text-black leading-none mb-4">
              {paidCount.toString().padStart(2, "0")}
            </p>
            <div className="h-1.5 w-16 bg-brand-success rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse" />
          </div>

          <div className="bg-zinc-900 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group transform hover:-translate-y-2 transition-all duration-500">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="text-8xl font-black italic text-white font-serif">
                FYT
              </div>
            </div>
            <p className="text-[10px] font-black text-brand-success uppercase tracking-[0.3em] mb-3 italic">
              Athlete Status
            </p>
            <p className="text-4xl font-black italic text-white leading-none uppercase tracking-tighter">
              Elite <span className="text-zinc-700">Level</span>
            </p>
          </div>
        </div>

        {/* 📋 Registration List Section */}
        <div className="space-y-12 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="flex items-center justify-between border-b-2 border-white/5 pb-10">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Registered <span className="opacity-20 text-white">Events</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-brand-success rounded-full animate-ping" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                Syncing Results
              </span>
            </div>
          </div>

          {!registrations || registrations.length === 0 ? (
            <EmptyTrackView />
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {/* Using explicit casting here matches the component props for the build */}
              {registrations.map((reg: any) => (
                <RegistrationCard key={reg.id} reg={reg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
