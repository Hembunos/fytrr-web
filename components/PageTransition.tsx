"use client";

import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounting, setIsMounting] = useState(true); // 🛡️ Flash Fix

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("initial-loader-run");

    // Delay logic strictly synced with InitialLoader exit
    const delay = hasLoaded ? 50 : 1100;

    const timer = setTimeout(() => {
      setIsLoaded(true);
      setIsMounting(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        isLoaded
          ? "opacity-100 translate-y-0 scale-100 blur-0"
          : "opacity-0 translate-y-12 scale-[0.96] blur-md"
      } ${isMounting ? "invisible" : "visible"}`} // 🛡️ Content hidden until logic clears
    >
      {children}
    </div>
  );
}
