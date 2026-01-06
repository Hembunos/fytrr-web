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
    <div className="group relative bg-white border border-zinc-200 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      {/* Decorative Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent group-hover:via-black transition-all duration-500" />

      <div className="p-8 space-y-6">
        {/* Date & Location */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {new Date(event.event_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
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

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              event.is_active
                ? "bg-green-100 text-green-700"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {event.is_active ? "Live" : "Past"}
          </span>
        </div>

        {/* Event Name */}
        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-tight text-black">
          {event.name.split(" ").map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "text-zinc-400" : ""}>
              {word}{" "}
            </span>
          ))}
        </h3>

        {/* Dynamic Action Button */}
        <div className="pt-4">
          {event.is_active ? (
            <Link
              href={`/event/${event.slug}`}
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Register Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            </Link>
          ) : (
            <Link
              href={`/results/${event.slug}`}
              className="flex items-center justify-center gap-2 w-full border-2 border-black text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-[0.98]"
            >
              View Results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
