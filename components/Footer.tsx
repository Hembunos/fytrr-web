"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-brand-secondary pt-24 pb-12 px-6 mt-auto border-t border-brand-muted">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Section: Branding and Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Info - Spans 2 columns on large screens */}
          <div className="sm:col-span-2 space-y-6 text-center sm:text-left">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              FYTRR{" "}
              <span className="text-brand-accent/50 underline decoration-brand-success decoration-4 underline-offset-8">
                RUN 2026
              </span>
            </h2>
            <p className="text-brand-accent text-xs md:text-sm max-w-sm leading-relaxed font-bold uppercase tracking-tight mx-auto sm:mx-0">
              Pushing limits in the heart of Dumka. Join the ultimate
              Hyrox-inspired challenge and claim your place in the hall of fame.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6 text-center sm:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent/60">
              Sitemap
            </h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-success transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-success transition-colors"
                >
                  Home
                </Link>
              </li>
              {/* Naya Section: Event History / Past Events */}
              <li>
                <Link
                  href="/events/history"
                  className="hover:text-brand-success transition-colors flex items-center justify-center sm:justify-start gap-2"
                >
                  Event History
                  <span className="text-[8px] bg-brand-muted px-2 py-0.5 rounded text-brand-success">
                    NEW
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-brand-success transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/format"
                  className="hover:text-brand-success transition-colors"
                >
                  Race Format
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-6 text-center sm:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent/60">
              Protocol
            </h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-brand-success transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-brand-success transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-brand-success transition-colors"
                >
                  Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright and Socials */}
        <div className="pt-10 border-t border-brand-muted flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="text-[9px] uppercase font-black tracking-[0.5em] text-brand-accent/40">
              © {currentYear} FYTRR ORG • BEYOND LIMITS • DUMKA, JH
            </p>
          </div>

          <div className="flex items-center gap-4 order-1 md:order-2">
            {/* Social Icons with brand-radius */}
            <div className="h-12 w-12 rounded-race bg-brand-muted flex items-center justify-center hover:bg-brand-success hover:text-brand-primary transition-all cursor-pointer group shadow-xl">
              <span className="text-xs font-black italic">IG</span>
            </div>
            <div className="h-12 w-12 rounded-race bg-brand-muted flex items-center justify-center hover:bg-brand-success hover:text-brand-primary transition-all cursor-pointer group shadow-xl">
              <span className="text-xs font-black italic">TW</span>
            </div>
            <Link
              href="/signup"
              className="bg-brand-secondary text-brand-primary px-6 py-3 rounded-race text-[10px] font-black uppercase tracking-widest hover:bg-brand-success hover:text-brand-primary transition-all shadow-lg"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
