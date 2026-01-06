"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginClient() {
  const params = useSearchParams();
  const router = useRouter();
  const redirectTo = params.get("redirectTo") || "/dashboard";
  const errorMsg = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password Toggle state
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(errorMsg ? { type: "error", msg: errorMsg } : null);

  async function login() {
    setStatus(null);
    if (!email || !password) {
      return setStatus({ type: "error", msg: "Please fill in all fields" });
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return setStatus({ type: "error", msg: error.message });
    }

    router.refresh();
    window.location.replace(redirectTo);
  }

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-white">
      {/* 🏎️ UI Upgrade: Background Athletic Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.03] select-none pointer-events-none">
        <div className="absolute top-10 -left-20 text-[20rem] font-black italic uppercase leading-none text-black">
          PACE
        </div>
        <div className="absolute bottom-10 -right-20 text-[20rem] font-black italic uppercase leading-none text-black">
          WIN
        </div>
      </div>

      <div className="z-10 w-full max-w-md p-10 space-y-10 bg-white/80 backdrop-blur-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] border border-zinc-100">
        {/* Header Section */}
        <div className="space-y-3 text-center">
          <div className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
            Secure Entry
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Welcome <span className="text-zinc-300">Back</span>
          </h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
            Athlete Access Only
          </p>
        </div>

        {/* Inline Status Messages */}
        {status && (
          <div
            className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in zoom-in duration-300 ${
              status.type === "error"
                ? "bg-red-50 text-red-500 border border-red-100"
                : "bg-green-50 text-green-600 border border-green-100"
            }`}
          >
            {status.msg}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-1.5 group">
            <label className="text-[10px] uppercase font-black text-zinc-400 ml-2 tracking-widest group-focus-within:text-black transition-colors">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border-2 border-zinc-50 p-5 rounded-[1.5rem] bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold placeholder:font-normal placeholder:text-zinc-300 text-sm"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@fytrr.in"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5 group relative">
            <label className="text-[10px] uppercase font-black text-zinc-400 ml-2 tracking-widest group-focus-within:text-black transition-colors">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border-2 border-zinc-50 p-5 rounded-[1.5rem] bg-zinc-50/50 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold placeholder:font-normal placeholder:text-zinc-300 text-sm"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="text-right px-2">
              <Link
                href="/forgot-password"
                className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
              >
                Reset Password
              </Link>
            </div>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="group relative w-full bg-black text-white p-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-900 disabled:opacity-50 transition-all active:scale-[0.97] shadow-2xl shadow-zinc-200 overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <svg
                    className="group-hover:translate-x-2 transition-transform duration-300"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </div>
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </div>

        {/* Brand Footer */}
        <div className="pt-6 text-center space-y-4">
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-black border-b-2 border-zinc-100 hover:border-black transition-all ml-1"
            >
              Join the Race
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
