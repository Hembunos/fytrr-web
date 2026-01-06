"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ initialUser }: { initialUser: any }) {
  const [user, setUser] = useState<any>(initialUser);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Listen for auth changes to update state across tabs
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Hide Navbar on specific auth-heavy pages if needed (optional)
  const isAuthPage = [
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ].includes(pathname);

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-black text-2xl italic tracking-tighter uppercase transition-transform group-hover:skew-x-[-10deg]">
            FYTRR <span className="text-zinc-400">RUN</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
          {!user ? (
            <>
              <Link
                href="/login"
                className={`hover:text-black transition-colors ${
                  pathname === "/login" ? "text-black" : "text-zinc-400"
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
              >
                Join Race
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`hover:text-black transition-colors flex items-center gap-2 ${
                  pathname === "/dashboard" ? "text-black" : "text-zinc-400"
                }`}
              >
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                Dashboard
              </Link>
              <button
                className="text-red-500 hover:text-red-600 transition-colors uppercase"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  router.push("/");
                  router.refresh();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
