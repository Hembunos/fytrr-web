"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupClient() {
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

  // ⚡ Functionality Intact: No changes to the logic
  async function handleSignup() {
    setStatus(null);
    if (!name || !email || !password) {
      return setStatus({ type: "error", msg: "Please fill all fields" });
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}`,
      },
    });

    setLoading(true); // Keeping loading until email is handled or error shown

    if (error) {
      setLoading(false);
      return setStatus({ type: "error", msg: error.message });
    }

    setLoading(false);
    setStatus({
      type: "success",
      msg: "Athlete profile created! Please check your email to verify.",
    });
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black selection:bg-brand-success selection:text-black">
      {/* 🏁 Background Athletic Branding: Stealth Sync */}
      <div className="absolute inset-0 z-0 opacity-[0.02] select-none pointer-events-none flex flex-col justify-between p-10 md:p-20">
        <div className="text-[12rem] md:text-[25rem] font-black italic uppercase leading-none text-white self-end translate-x-1/4">
          START
        </div>
        <div className="text-[12rem] md:text-[25rem] font-black italic uppercase leading-none text-white self-start -translate-x-1/4">
          FAST
        </div>
      </div>

      {/* 🛡️ Signup Card: Consistent with Dashboard & Login */}
      <div className="z-10 w-full max-w-md p-8 md:p-14 space-y-12 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-race border-t-[8px] border-black animate-in fade-in zoom-in duration-700">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            2026 Registration
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-black">
            Join The <span className="text-black/20">Race</span>
          </h1>
          <p className="text-black/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Create your official athlete profile
          </p>
        </div>

        {/* Status Messages */}
        {status && (
          <div
            className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2 ${
              status.type === "error"
                ? "bg-red-50 text-red-500 border border-red-100"
                : "bg-green-50 text-brand-success border border-green-100"
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-3 group">
            <label className="text-[10px] uppercase font-black text-black/30 ml-2 tracking-widest group-focus-within:text-black transition-colors">
              Full Name
            </label>
            <input
              className="w-full border-2 border-black/[0.05] p-5 rounded-2xl bg-[#fcfcfc] text-black focus:bg-white focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all font-black uppercase italic placeholder:font-normal placeholder:text-black/20 text-sm shadow-sm"
              placeholder="e.g. Rahul Hembram"
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-3 group">
            <label className="text-[10px] uppercase font-black text-black/30 ml-2 tracking-widest group-focus-within:text-black transition-colors">
              Email Address
            </label>
            <input
              className="w-full border-2 border-black/[0.05] p-5 rounded-2xl bg-[#fcfcfc] text-black focus:bg-white focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all font-black uppercase italic placeholder:font-normal placeholder:text-black/20 text-sm shadow-sm"
              type="email"
              placeholder="athlete@email.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-3 group relative">
            <label className="text-[10px] uppercase font-black text-black/30 ml-2 tracking-widest group-focus-within:text-black transition-colors">
              Security Password
            </label>
            <div className="relative">
              <input
                className="w-full border-2 border-black/[0.05] p-5 rounded-2xl bg-[#fcfcfc] text-black focus:bg-white focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all font-black placeholder:text-black/20 text-sm shadow-sm"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Signup Button: Consistent with Navbar CTA */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="group relative w-full bg-black text-white p-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-success hover:text-black transition-all active:scale-[0.97] shadow-2xl overflow-hidden mt-4"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 italic">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  Claim My Spot
                  <svg
                    className="group-hover:translate-x-2 transition-transform duration-300"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Brand Footer */}
        <div className="pt-8 text-center border-t border-black/[0.05]">
          <p className="text-[10px] text-black/40 font-black uppercase tracking-widest">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-black border-b-2 border-black/10 hover:border-brand-success transition-all ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
