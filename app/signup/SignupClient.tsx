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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

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
        // IMPORTANT: Added /api to match your folder structure and Supabase config
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}`,
      },
    });

    setLoading(false);

    if (error) {
      return setStatus({ type: "error", msg: error.message });
    }

    setStatus({
      type: "success",
      msg: "Registration successful! Check your email to verify your account.",
    });
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-2xl rounded-[2.5rem] border border-zinc-100">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Registration
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Join the <span className="text-zinc-400">Race</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">
            Create your athlete profile for FYTRR RUN 2026
          </p>
        </div>

        {/* Status Messages */}
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
              Full Name
            </label>
            <input
              className="w-full border-2 border-zinc-100 p-4 rounded-2xl focus:border-black outline-none transition-all font-bold placeholder:font-normal placeholder:text-zinc-200"
              placeholder="e.g. Rahul Hembram"
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">
              Email Address
            </label>
            <input
              className="w-full border-2 border-zinc-100 p-4 rounded-2xl focus:border-black outline-none transition-all font-bold placeholder:font-normal placeholder:text-zinc-200"
              type="email"
              placeholder="athlete@email.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">
              Security Password
            </label>
            <input
              className="w-full border-2 border-zinc-100 p-4 rounded-2xl focus:border-black outline-none transition-all font-bold placeholder:font-normal placeholder:text-zinc-200"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-[0.98] shadow-xl shadow-zinc-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registering...
              </div>
            ) : (
              "Claim My Spot"
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight">
            Already a participant?{" "}
            <Link
              href="/login"
              className="text-black border-b-2 border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-all ml-1"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
