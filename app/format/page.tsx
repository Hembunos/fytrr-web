"use client";

import React, { useRef, useState, useEffect } from "react";
// Adjust this import path based on where you saved the file above
import { raceDataGroups, exerciseCards } from "@/lib/raceData";

export default function RaceFormat() {
  const matrixRef = useRef<HTMLDivElement>(null);
  const movementRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    window.scrollTo({
      top: ref.current ? ref.current.offsetTop - 100 : 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-success selection:text-black antialiased relative">
      {/* 📍 Sticky Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-center px-2">
          <button
            onClick={() => scrollToSection(matrixRef)}
            className="flex-1 py-2 text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-brand-success transition-all"
          >
            Matrix
          </button>
          <div className="h-4 w-px bg-white/20" />
          <button
            onClick={() => scrollToSection(movementRef)}
            className="flex-1 py-2 text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-brand-success transition-all"
          >
            Movements
          </button>
        </div>
      </nav>

      {/* 🔝 Back To Top Button with Bold SVG Arrow */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-[100] px-6 py-3 bg-brand-success text-black rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all duration-500 hover:scale-105 active:scale-95 ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
        <span className="text-[12px] font-black uppercase tracking-wider hidden sm:block leading-none">
          Back to the top
        </span>
      </button>

      {/* Giant Decorative Background Text */}
      <div className="fixed top-0 right-0 opacity-[0.03] select-none pointer-events-none overflow-hidden z-0">
        <div className="text-[15rem] md:text-[25rem] font-black italic uppercase -rotate-12 translate-x-1/4">
          WORKOUT
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-12 space-y-20 md:space-y-32 relative z-10 pt-24 pb-20">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Competition Grade Manual
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8]">
            Race <br className="md:hidden" />{" "}
            <span className="text-white/20">Matrix</span>
          </h1>
        </div>

        {/* 📊 Matrix Section */}
        <div ref={matrixRef} className="space-y-8 scroll-mt-28">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl md:text-5xl font-black italic uppercase text-brand-success tracking-tighter text-shadow">
              Event Breakdown
            </h2>
          </div>
          <div className="overflow-x-auto border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-md">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-brand-success text-black uppercase font-black italic text-xs md:text-sm">
                  <th className="p-4 md:p-8 border-r border-black/10">
                    Zone & Segment
                  </th>
                  <th className="p-4 md:p-8 border-r border-black/10">
                    Activity
                  </th>
                  <th className="p-4 md:p-8 border-r border-black/10 text-center">
                    Female
                  </th>
                  <th className="p-4 md:p-8 border-r border-black/10 text-center">
                    Male
                  </th>
                  <th className="p-4 md:p-8 text-center">Mixed</th>
                </tr>
              </thead>
              <tbody className="text-[11px] md:text-xs font-bold tracking-wider uppercase">
                {raceDataGroups.map((group, groupIdx) => (
                  <React.Fragment key={groupIdx}>
                    {group.activities.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={`border-b border-white/5 hover:bg-white/[0.05] transition-colors ${row.type === "run" ? "bg-white/[0.04]" : ""}`}
                      >
                        {rowIdx === 0 && (
                          <td
                            rowSpan={group.activities.length}
                            className="p-4 md:p-8 border-r border-white/5 align-middle text-center bg-black/20"
                          >
                            <span className="text-brand-success italic font-[900] block text-xl md:text-4xl tracking-tight uppercase whitespace-nowrap">
                              {group.zone}
                            </span>
                            <span className="text-[9px] text-white/30 block tracking-tighter leading-none mt-2 uppercase italic font-bold">
                              {group.sub}
                            </span>
                          </td>
                        )}
                        <td className="p-4 md:p-8 text-white border-r border-white/5 font-bold tracking-wide">
                          {row.activity}
                        </td>
                        <td className="p-4 md:p-8 text-center text-white/60 border-r border-white/5">
                          {row.female}
                        </td>
                        <td className="p-4 md:p-8 text-center text-white/60 border-r border-white/5">
                          {row.male}
                        </td>
                        <td className="p-4 md:p-8 text-center text-white/60">
                          {row.mixed}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 📸 Movements Section */}
        <div ref={movementRef} className="space-y-12 scroll-mt-28">
          <div className="border-l-[12px] border-brand-success pl-6">
            <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Movements
            </h2>
            <p className="text-xs md:text-sm text-white/40 uppercase font-bold tracking-[0.5em] mt-2 italic">
              Official Technique Guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
            {exerciseCards.map((card, idx) => (
              <div
                key={idx}
                className="group flex flex-col relative overflow-hidden rounded-[3rem] border border-white/10 bg-zinc-900/10 transition-all duration-700 hover:border-brand-success/50 hover:bg-zinc-900/30"
              >
                <div className="p-8 md:p-12 space-y-8 flex-grow">
                  <div className="flex justify-between items-start gap-4 min-h-[80px] md:min-h-[110px]">
                    <div className="space-y-1">
                      <h3 className="text-4xl md:text-5xl font-black italic uppercase text-brand-success leading-[0.9]">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-white/20 font-black uppercase tracking-widest italic">
                        {card.sub}
                      </p>
                    </div>
                    <span className="shrink-0 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                      {card.zone}
                    </span>
                  </div>
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-3xl bg-black relative border border-white/5 shadow-2xl">
                    <img
                      src={card.img}
                      alt={card.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 opacity-60 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-8 border-t border-white/10">
                    {[
                      { label: "Female", val: card.female },
                      { label: "Male", val: card.male },
                      { label: "Mixed", val: card.mixed },
                    ].map((stat, sIdx) => (
                      <div
                        key={sIdx}
                        className={`text-center ${sIdx === 1 ? "border-x border-white/10" : ""}`}
                      >
                        <p className="text-brand-success text-[10px] font-black italic mb-2 uppercase tracking-tighter">
                          {stat.label}
                        </p>
                        <p className="text-xs md:text-base font-black whitespace-nowrap">
                          {stat.val}
                        </p>
                        <p className="text-[9px] text-white/30 font-bold uppercase italic mt-1">
                          {card.reps}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
