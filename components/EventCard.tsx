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
    /* 🏎️ h-full aur flex-col se card ki height grid row ke barabar stretch hogi */
    <div className="group relative bg-brand-secondary border border-brand-accent/10 rounded-race overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 flex flex-col h-full">
      {/* ⚡ High-Impact Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-muted overflow-hidden">
        <div className="w-full h-full bg-brand-success translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
      </div>

      {/* flex-grow content area ko stretch karega aur mt-auto button ko niche push karega */}
      <div className="p-8 md:p-10 flex flex-col flex-grow">
        <div className="flex-grow space-y-8">
          {/* Date, Location & Status Badge */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent group-hover:text-brand-primary transition-colors duration-500">
                {new Date(event.event_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-[10px] md:text-[11px] font-black text-brand-accent/60 uppercase flex items-center gap-1.5 italic">
                <svg
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
              className={`px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                event.is_active
                  ? "bg-brand-success/10 text-brand-success border border-brand-success/20 group-hover:bg-brand-success group-hover:text-brand-primary"
                  : "bg-brand-muted text-brand-accent/40 border border-brand-accent/10"
              }`}
            >
              {event.is_active ? "Registration Open" : "Event Closed"}
            </span>
          </div>

          {/* Event Name */}
          <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-[0.9] text-brand-primary transition-all duration-500 group-hover:tracking-tight">
            {event.name.split(" ").map((word, i) => (
              <span
                key={i}
                className={i % 2 !== 0 ? "text-brand-accent/20" : ""}
              >
                {word}{" "}
              </span>
            ))}
          </h3>
        </div>

        {/* 🚀 mt-auto ensures button is always at the bottom of the card */}
        <div className="pt-8 mt-auto">
          {event.is_active ? (
            <Link
              href={`/event/${event.slug}`}
              className="group/btn relative flex items-center justify-center gap-3 w-full bg-brand-primary text-brand-secondary py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs overflow-hidden transition-all active:scale-[0.96] shadow-xl shadow-brand-primary/10"
            >
              <span className="relative z-10">Register For Race</span>
              <svg
                className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-secondary/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            </Link>
          ) : (
            <Link
              href={`/event/${event.slug}/results`}
              className="flex items-center justify-center gap-2 w-full border-2 border-brand-primary text-brand-primary py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-brand-primary hover:text-brand-secondary transition-all duration-500 active:scale-[0.96]"
            >
              View Official Results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
