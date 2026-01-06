"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // PKCE Fix: Redirect to callback instead of the direct page
      redirectTo: `${window.location.origin}/api/auth/callback?next=/update-password`,
    });

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setMessage("Check your email for the password reset link!");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-20 space-y-4 shadow-xl rounded-2xl border border-zinc-100">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-zinc-500">
          Enter your email to receive a reset link
        </p>
      </div>

      {message ? (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {message}
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-all"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <div className="text-center">
        <Link href="/login" className="text-sm text-zinc-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
