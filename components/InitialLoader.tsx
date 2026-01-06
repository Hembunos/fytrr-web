"use client";

import { useEffect, useState } from "react";

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Start as false

  useEffect(() => {
    // 1. Check if the loader has already run in this session
    const hasLoaded = sessionStorage.getItem("initial-loader-run");

    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    // 2. If not, make it visible and start the animation
    setIsVisible(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExiting(true);

          // 3. Mark as "run" so it doesn't show again on redirects
          sessionStorage.setItem("initial-loader-run", "true");

          setTimeout(() => setIsVisible(false), 700);
          return 100;
        }
        return prev + 10; // Faster increment for better UX
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-700 ease-in-out ${
        isExiting
          ? "opacity-0 pointer-events-none translate-y-[-10px]"
          : "opacity-100"
      }`}
    >
      <div className="w-64 space-y-4">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            FYTRR <span className="text-zinc-500">RUN 2026</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1">
            Preparing your dashboard
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="h-[2px] w-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="flex justify-end">
          <span className="text-[10px] font-mono text-zinc-400">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
