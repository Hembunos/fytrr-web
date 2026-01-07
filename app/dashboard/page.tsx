import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Suspense } from "react";
import SuccessToast from "@/components/SuccessToast";
import Link from "next/link";
import { RegistrationCard } from "@/components/dashboard/RegistrationCard";
import { EmptyTrackView } from "@/components/dashboard/EmptyTrackView";
import { LayoutDashboard } from "lucide-react";

/* 🔹 1. FINAL INTERFACE (Supabase compatibility ke liye) */
interface Registration {
  id: string;
  status: string;
  created_at: string;

  events: {
    name: string;
    slug: string;
  } | null;

  categories: {
    name: string;
    price: number;
    bib_prefix: string;
  } | null;

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
  const { data, error } = await supabase
    .from("registrations")
    .select(
      `
        id,
        status,
        created_at,

        events:events!registrations_event_id_fkey (
          name,
          slug
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

  // 🔹 TYPE CASTING (build safety)
  const registrations = data as unknown as Registration[] | null;

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
    /* ✅ ONLY CHANGE: pt-16 added here */
    <div className="relative min-h-screen bg-black pb-24 font-sans selection:bg-brand-success selection:text-black overflow-x-hidden">
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>
      {/* ⬛ HERO SECTION */}
      <div
        className="
    relative w-full
    min-h-[440px] md:h-[450px] 
    bg-[#050505]
    flex items-start md:items-end   /* 👈 Mobile par top-aligned */
    pt-24 pb-12 md:pt-24 md:pb-20   /* 👈 pt-24 kiya (32 se kam) taaki thoda upar jaye */
    overflow-hidden
    border-b border-white/5
  "
      >
        {/* BACKGROUND TEXT */}
        <div className="absolute inset-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center">
          <div className="text-[12rem] md:text-[30rem] font-black italic uppercase leading-none text-white tracking-tighter -rotate-6">
            ATHLETE
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-20">
          {/* Center Align for Mobile, Bottom-Space-Between for Desktop */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
            <div className="max-w-4xl space-y-5 flex flex-col items-center md:items-start">
              {/* Profile Tags */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <span className="px-4 py-1.5 bg-brand-success text-black rounded-full italic text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                  ● {isAdmin ? "Admin Profile" : "Live Profile"}
                </span>
                <span className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px] italic md:border-l border-white/10 md:pl-4">
                  FYTRR Protocol v1.0
                </span>
              </div>

              {/* Title: MY TRACK */}
              <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white">
                MY <br />
                <span
                  className="drop-shadow-sm opacity-20"
                  style={{
                    WebkitTextStroke: "1px white",
                    color: "transparent",
                  }}
                >
                  TRACK
                </span>
              </h1>

              {/* Subtitle: Center aligned on mobile */}
              <p className="text-brand-success/60 text-[9px] md:text-xs font-black uppercase tracking-[0.3em] max-w-[260px] md:max-w-sm italic md:border-l-2 border-brand-success md:pl-6">
                Performance Intelligence & Race Identity Management
              </p>
            </div>

            {/* Admin Button */}
            {isAdmin && (
              <div className="relative z-30 w-full md:w-auto mt-4 md:mt-0">
                <Link
                  href="/admin"
                  className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 md:py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-success transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-95 border-2 border-transparent"
                >
                  <LayoutDashboard
                    size={16}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Admin Control Center
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 📊 CONTENT SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 -mt-10 md:-mt-12 space-y-16">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Deployments - Added Hover Effect */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-brand-success/10 cursor-default group">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic mb-2 group-hover:text-black transition-colors">
              Total Deployments
            </p>
            <p className="text-6xl font-black italic text-black leading-none">
              {registrations?.length.toString().padStart(2, "0") || "00"}
            </p>
          </div>

          {/* Verified BIBs - Bottom Strip Hataya aur Bar Chota Kiya */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-brand-success/20 cursor-default group">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic mb-2 group-hover:text-black transition-colors">
              Verified BIBs
            </p>

            {/* Container for Number + Bar */}
            <div className="flex flex-col items-start leading-none">
              <p className="text-6xl font-black italic text-black">
                {paidCount.toString().padStart(2, "0")}
              </p>

              {/* 🟢 Compact Green Bar (Width Chota Kiya) */}
              <div className="mt-2.5 h-1.5 w-12 bg-brand-success rounded-full shadow-[0_4px_12px_rgba(34,197,94,0.4)] animate-in fade-in slide-in-from-left duration-1000" />
            </div>
          </div>

          {/* Athlete Status - Added Hover Effect (Glow) */}
          <div className="bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(34,197,94,0.15)] border border-white/5 cursor-default group">
            <p className="text-[10px] font-black text-brand-success uppercase tracking-widest italic mb-2 group-hover:animate-pulse">
              Athlete Status
            </p>
            <p className="text-4xl font-black italic text-white uppercase leading-none">
              Elite{" "}
              <span className="text-zinc-700 transition-colors group-hover:text-zinc-500">
                Level
              </span>
            </p>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b-2 border-white/5 pb-10">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Registered <span className="opacity-20 text-white">Events</span>
            </h2>
          </div>

          {!registrations || registrations.length === 0 ? (
            <EmptyTrackView />
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {registrations.map((reg) => (
                <RegistrationCard key={reg.id} reg={reg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
