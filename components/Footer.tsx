"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              FYTRR <span className="text-zinc-500">RUN 2026</span>
            </h2>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              Pushing limits in the heart of Dumka. Join the ultimate
              Hyrox-inspired challenge and claim your place in the hall of fame.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-bold uppercase tracking-tight">
              <li>
                <Link
                  href="/"
                  className="hover:text-zinc-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/past-events"
                  className="hover:text-zinc-400 transition-colors"
                >
                  Past Events
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-zinc-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Legal
            </h4>
            <ul className="space-y-2 text-sm font-bold uppercase tracking-tight">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-zinc-400 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-zinc-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-zinc-400 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            © 2026 FYTRR ORG. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 cursor-pointer transition-colors">
              <span className="text-[10px]">IG</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 cursor-pointer transition-colors">
              <span className="text-[10px]">TW</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
