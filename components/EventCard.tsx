"use client";

import Link from "next/link";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    slug: string;
    event_date: string;
    location: string;
    is_active: boolean;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3">
      {/* ⚡ High-Impact Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-100 overflow-hidden">
        <div className="w-full h-full bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
      </div>

      <div className="p-10 space-y-8">
        {/* Date, Location & Status Badge */}
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 group-hover:text-black transition-colors duration-500">
              {new Date(event.event_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-[11px] font-black text-zinc-500 uppercase flex items-center gap-1.5 italic">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </p>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              event.is_active
                ? "bg-green-50 text-green-600 border border-green-100 group-hover:bg-green-500 group-hover:text-white"
                : "bg-zinc-50 text-zinc-400 border border-zinc-100"
            }`}
          >
            {event.is_active ? "Registration Open" : "Event Closed"}
          </span>
        </div>

        {/* Event Name - Bold Athletic Typography */}
        <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.9] text-black transition-all duration-500 group-hover:tracking-tight">
          {event.name.split(" ").map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "text-zinc-200" : ""}>
              {word}{" "}
            </span>
          ))}
        </h3>

        {/* Dynamic Action Button */}
        <div className="pt-4">
          {event.is_active ? (
            <Link
              href={`/event/${event.slug}`}
              className="group/btn relative flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs overflow-hidden transition-all active:scale-[0.96]"
            >
              <span className="relative z-10">Register For Race</span>
              <svg
                className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            </Link>
          ) : (
            <Link
              href={`/event/${event.slug}/results`}
              className="flex items-center justify-center gap-2 w-full border-2 border-zinc-900 text-black py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all duration-500 active:scale-[0.96]"
            >
              View Official Results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
