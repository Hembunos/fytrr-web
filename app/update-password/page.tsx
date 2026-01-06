"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (password.length < 6) {
      return setStatus({
        type: "error",
        msg: "Password must be at least 6 characters",
      });
    }

    setLoading(true);
    // This updates the user's password in the current session established by the callback
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setStatus({ type: "error", msg: error.message });
    } else {
      setStatus({ type: "success", msg: "Password updated! Redirecting..." });
      // Short delay so they see the success message
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-2xl rounded-[2.5rem] border border-zinc-100">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Account Security
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter italic">
            Reset <span className="text-zinc-400">Password</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">
            Enter a strong new password for your FYTRR account
          </p>
        </div>

        {status && (
          <div
            className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
              status.type === "error"
                ? "bg-red-50 text-red-500 border border-red-100"
                : "bg-green-50 text-green-600 border border-green-100"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="relative group">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border-2 border-zinc-100 p-4 rounded-2xl focus:border-black outline-none transition-all font-bold placeholder:text-zinc-200"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-[0.98] shadow-xl shadow-zinc-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              "Confirm New Password"
            )}
          </button>
        </form>

        <p className="text-[10px] text-zinc-400 text-center font-bold uppercase tracking-widest">
          Secure Encrypted Session
        </p>
      </div>
    </div>
  );
}
