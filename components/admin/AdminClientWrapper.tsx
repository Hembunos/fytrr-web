"use client";

import { useState, useEffect } from "react";
import StatsGrid from "./StatsGrid";
import EventManager from "./EventManager";
import CreateEventModal from "./CreateEventModal";
import { PlusCircle, ExternalLink } from "lucide-react"; // Naya icon add kiya
import Link from "next/link"; // Link import kiya

export default function AdminClientWrapper({
  initialEvents,
}: {
  initialEvents: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState(initialEvents);

  // Sync state with server data
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 mb-20 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Admin <span className="text-zinc-400">Control</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
            Race Management & Financial Intelligence
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* 🏠 View Site Button: Admin ko Home page par bhejne ke liye */}
          <Link
            href="/"
            className="flex items-center gap-2 bg-zinc-100 text-zinc-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all border border-zinc-200 active:scale-95"
          >
            <ExternalLink size={14} /> View Site
          </Link>

          {/* ➕ Create New Event Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-success hover:text-black transition-all active:scale-95 shadow-lg border border-black"
          >
            <PlusCircle size={14} /> Create New Event
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <StatsGrid events={events} />

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            Event Management
          </h2>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
            {events.length} Active Protocols
          </span>
        </div>

        <div className="grid gap-6">
          {events.length > 0 ? (
            events.map((event) => <EventManager key={event.id} event={event} />)
          ) : (
            <div className="p-20 text-center border-2 border-dashed rounded-[3rem] text-zinc-400 font-bold uppercase text-xs italic">
              No events found.
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
