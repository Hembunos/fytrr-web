"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/update-password`,
    });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage("Check your email for the password reset link!");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black selection:bg-brand-success selection:text-black font-sans">
      {/* 🏁 Background Athletic Branding: Stealth Sync */}
      <div className="absolute inset-0 z-0 opacity-[0.02] select-none pointer-events-none flex flex-col justify-between p-10 md:p-20">
        <div className="text-[12rem] md:text-[25rem] font-black italic uppercase leading-none text-white self-start -translate-x-1/4">
          RESET
        </div>
        <div className="text-[12rem] md:text-[25rem] font-black italic uppercase leading-none text-white self-end translate-x-1/4">
          FOCUS
        </div>
      </div>

      {/* 🛡️ Reset Card: White & High-Contrast */}
      <div className="z-10 w-full max-w-md p-8 md:p-14 space-y-10 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-race border-t-[8px] border-black animate-in fade-in zoom-in duration-700">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            Account Recovery
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-black">
            Forgot <span className="text-black/20">Password?</span>
          </h1>
          <p className="text-black/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Enter your email to resume the race
          </p>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="p-5 bg-green-50 text-brand-success border border-green-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
            {message}
          </div>
        )}

        {errorMsg && (
          <div className="p-5 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
            {errorMsg}
          </div>
        )}

        {!message && (
          <form onSubmit={handleReset} className="space-y-8">
            <div className="space-y-3 group">
              <label className="text-[10px] uppercase font-black text-black/30 ml-2 tracking-widest group-focus-within:text-black transition-colors">
                Email Address
              </label>
              <input
                type="email"
                placeholder="athlete@fytrr.in"
                className="w-full border-2 border-black/[0.05] p-5 rounded-2xl bg-[#fcfcfc] text-black focus:bg-white focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all font-black uppercase italic placeholder:font-normal placeholder:text-black/20 text-sm shadow-sm"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              disabled={loading}
              className="group relative w-full bg-black text-white p-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-success hover:text-black transition-all active:scale-[0.97] shadow-2xl overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 italic">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
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
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors border-b border-transparent hover:border-black"
          >
            ← Back to Login
          </Link>
        </div>
      </div>

      {/* Brand Footer Decoration */}
      <div className="absolute bottom-10 opacity-[0.1] text-center">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-white">
          FYTRR • BEYOND LIMITS
        </p>
      </div>
    </div>
  );
}
