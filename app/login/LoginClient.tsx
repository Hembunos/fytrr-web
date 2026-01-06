"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginClient() {
  const params = useSearchParams();
  const router = useRouter();
  const redirectTo = params.get("redirectTo") || "/dashboard";
  const errorMsg = params.get("error"); // Capture errors from auth callback

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    // Force refresh ensures Middleware and Navbar recognize the session
    router.refresh();
    window.location.replace(redirectTo);
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-2xl rounded-[2.5rem] border border-zinc-100">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Athlete Portal
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Welcome <span className="text-zinc-400">Back</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">
            Access your BIB and race details
          </p>
        </div>

        {/* Inline Status Messages */}
        {status && (
          <div
            className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center ${
              status.type === "error"
                ? "bg-red-50 text-red-500 border border-red-100"
                : "bg-green-50 text-green-600 border border-green-100"
            }`}
          >
            {status.msg}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border-2 border-zinc-100 p-4 rounded-2xl focus:border-black outline-none transition-all font-bold placeholder:font-normal placeholder:text-zinc-200"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border-2 border-zinc-100 p-4 rounded-2xl focus:border-black outline-none transition-all font-bold placeholder:font-normal placeholder:text-zinc-200"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <div className="text-right px-1">
              <Link
                href="/forgot-password"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="group relative w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-[0.98] shadow-xl shadow-zinc-100"
          >
            <div className="flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <svg
                    className="group-hover:translate-x-1 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Footer Links */}
        <div className="pt-4 text-center">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight">
            New to FYTRR?{" "}
            <Link
              href="/signup"
              className="text-black border-b-2 border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-all ml-1"
            >
              Create Athlete Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
