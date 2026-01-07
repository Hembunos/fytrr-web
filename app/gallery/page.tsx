"use client";

import Link from "next/link";

export default function GalleryPage() {
  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000",
      title: "The Start Line",
      size: "tall",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1461896756913-c8b40e7218c4?q=80&w=1000",
      title: "Pure Grit",
      size: "wide",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1532444458054-015fddf2b2ca?q=80&w=1000",
      title: "Dumka Spirit",
      size: "small",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1000",
      title: "Pace Control",
      size: "tall",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000",
      title: "Final Sprint",
      size: "small",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1530549387074-6aa1995f5d99?q=80&w=1000",
      title: "Recovery Zone",
      size: "wide",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-brand-success selection:text-black font-sans overflow-x-hidden">
      {/* ⬛ Giant Decorative Background Text */}
      <div className="absolute top-0 right-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="text-[15rem] md:text-[30rem] font-black italic uppercase text-white tracking-tighter -rotate-12 translate-x-1/4">
          ARCHIVE
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header Section: Matches Layout Typography */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 border-b border-white/5 pb-16 text-center md:text-left">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              Visual Protocol
            </div>
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
              Capture <br /> <span className="text-white/20">The Pace.</span>
            </h1>
            <p className="text-white/40 uppercase font-black tracking-[0.5em] text-[10px] border-l-2 border-brand-success pl-4">
              Beyond Limits • Visual Archive 2026
            </p>
          </div>
          <Link
            href="/"
            className="text-[11px] font-black uppercase border-b-2 border-white/10 pb-2 hover:text-brand-success hover:border-brand-success transition-all italic tracking-widest"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Industry-Grade Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[350px]">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-race bg-white/[0.03] border border-white/5 transition-all duration-700 hover:scale-[0.99] hover:border-white/20 shadow-2xl ${
                photo.size === "tall"
                  ? "row-span-2"
                  : photo.size === "wide"
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              {/* Image: Grayscale-to-Color logic enhanced with duration-1000 */}
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
              />

              {/* Responsive Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

              <div className="absolute bottom-8 left-8 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-success italic">
                  Moment 0{photo.id}
                </p>
                <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-lg">
                  {photo.title}
                </h3>
              </div>

              {/* Decorative Athletic Corner Border on Hover */}
              <div className="absolute top-6 right-6 w-0 h-0 border-t-2 border-r-2 border-brand-success opacity-0 group-hover:w-8 group-hover:h-8 group-hover:opacity-100 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Responsive CTA: Synced with Home Section Buttons */}
        <div className="py-32 text-center border-t border-white/5">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[1em] mb-10 italic">
            Ready to be in the next frame?
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-brand-success transition-all active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-xs italic"
          >
            Claim Your Spot
          </Link>
        </div>
      </div>
    </div>
  );
}
