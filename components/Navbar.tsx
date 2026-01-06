"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ initialUser }: { initialUser: any }) {
  const [user, setUser] = useState<any>(initialUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-brand-accent/10 bg-brand-secondary/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6">
        {/* Brand Logo - Updated to Brand Tokens */}
        <Link href="/" className="group flex items-center gap-2 relative z-50">
          <span className="font-black text-2xl italic tracking-tighter uppercase transition-all group-hover:tracking-widest text-brand-primary">
            FYTRR <span className="text-brand-accent">RUN</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
          {!user ? (
            <>
              <Link
                href="/login"
                className={`hover:text-brand-primary transition-colors ${
                  pathname === "/login"
                    ? "text-brand-primary"
                    : "text-brand-accent"
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-brand-primary text-brand-secondary px-8 py-3.5 rounded-race hover:bg-brand-success transition-all active:scale-95 shadow-lg shadow-brand-success/10"
              >
                Join Race
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`hover:text-brand-primary transition-colors flex items-center gap-2 ${
                  pathname === "/dashboard"
                    ? "text-brand-primary"
                    : "text-brand-accent"
                }`}
              >
                <span className="h-1.5 w-1.5 bg-brand-success rounded-full animate-pulse" />
                Dashboard
              </Link>
              <button
                className="text-brand-danger hover:opacity-70 transition-colors uppercase cursor-pointer"
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

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden relative z-50 p-2 text-brand-primary"
          onClick={toggleMenu}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition-all ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-brand-secondary z-40 flex flex-col items-center justify-center gap-12 transition-all duration-500 md:hidden ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-8 text-xl font-black italic uppercase tracking-tighter">
            <Link href="/" onClick={toggleMenu} className="text-brand-primary">
              Home
            </Link>
            <Link
              href="/gallery"
              onClick={toggleMenu}
              className="text-brand-primary"
            >
              Gallery
            </Link>

            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={toggleMenu}
                  className="text-brand-accent"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={toggleMenu}
                  className="bg-brand-primary text-brand-secondary px-10 py-4 rounded-race"
                >
                  Join Race
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={toggleMenu}
                  className="text-brand-success"
                >
                  Dashboard
                </Link>
                <button
                  className="text-brand-danger"
                  onClick={async () => {
                    toggleMenu();
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
      </div>
    </nav>
  );
}
