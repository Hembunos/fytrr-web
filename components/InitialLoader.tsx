"use client";

import { useEffect, useState } from "react";

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // 🛡️ Flash Fix: Start by checking

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("initial-loader-run");

    if (hasLoaded) {
      setIsVisible(false);
      setIsChecking(false);
      return;
    }

    // Pehli baar hai, toh loader active karo
    setIsVisible(true);
    setIsChecking(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExiting(true), 200);
          sessionStorage.setItem("initial-loader-run", "true");
          setTimeout(() => setIsVisible(false), 900);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next > 100 ? 100 : next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // 🛑 Flash Protection: Jab tak hum check kar rahe hain, full black screen dikhao
  if (isChecking) {
    return <div className="fixed inset-0 z-[9999] bg-black" />;
  }

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isExiting
          ? "opacity-0 pointer-events-none scale-110 blur-xl"
          : "opacity-100"
      }`}
    >
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-success/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-72 space-y-8 relative z-10">
        {/* Branding Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5 mb-4 animate-pulse">
            <div className="h-1.5 w-1.5 bg-brand-success rounded-full" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">
              System Booting
            </span>
          </div>

          <h1 className="text-4xl font-black italic tracking-tighter text-white leading-none">
            FYTRR{" "}
            <span className="text-brand-success drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
              RUN
            </span>
          </h1>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 italic">
            Performance Intelligence
          </p>
        </div>

        {/* Progress System */}
        <div className="space-y-4">
          <div className="h-[3px] w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-brand-success transition-all duration-500 ease-out shadow-[0_0_15px_rgba(34,197,94,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center font-mono">
            <span className="text-[9px] text-zinc-600 uppercase tracking-widest">
              {progress < 100 ? "Loading Protocol..." : "Sync Complete"}
            </span>
            <span className="text-xs font-black text-brand-success">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">
        Authorized Athlete Access Only
      </div>
    </div>
  );
}
