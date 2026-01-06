"use client";

import { useState } from "react";
import Link from "next/link";

export default function GalleryPage() {
  // Dummy images - Replace with your actual CDN links later
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
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-zinc-900 pb-12">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
              Capture <br /> <span className="text-zinc-800">The Pace.</span>
            </h1>
            <p className="text-zinc-500 uppercase font-black tracking-[0.5em] text-[10px]">
              Beyond Limits • Visual Archive
            </p>
          </div>
          <Link
            href="/"
            className="text-[10px] font-black uppercase border-b-2 border-white pb-1 hover:opacity-50 transition-all italic"
          >
            Back to Home
          </Link>
        </div>

        {/* Dynamic Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-zinc-900 transition-all duration-700 hover:scale-[0.98] ${
                photo.size === "tall"
                  ? "row-span-2"
                  : photo.size === "wide"
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              {/* Image */}
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

              <div className="absolute bottom-8 left-8 space-y-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Moment 0{photo.id}
                </p>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                  {photo.title}
                </h3>
              </div>

              {/* Athletic Border */}
              <div className="absolute inset-0 border-[0px] group-hover:border-[16px] border-black/20 transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="py-20 text-center border-t border-zinc-900">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[1em] mb-8">
            Ready to be in the next frame?
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest hover:invert transition-all active:scale-95"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
