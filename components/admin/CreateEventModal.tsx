"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateEventModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    location: "",
    event_date: "",
    is_active: true,
  });

  // Name likhte hi automatic slug suggest karega, par manual edit bhi kar sakte hain
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("events").insert([formData]);
      if (error) throw error;

      setFormData({
        name: "",
        slug: "",
        location: "",
        event_date: "",
        is_active: true,
      });
      onClose();
      router.refresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-start pt-10 md:pt-20 bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative animate-in slide-in-from-bottom-10 duration-500">
        {/* ✕ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors font-black text-2xl z-10"
        >
          ✕
        </button>

        {/* 🔥 Aggressive Header Section */}
        <div className="mb-12 relative">
          <p className="text-[10px] font-black uppercase text-brand-success tracking-[0.5em] mb-3 italic">
            System Protocol
          </p>

          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.85] text-black">
            DEPLOY <br />
            <span
              className="text-white drop-shadow-sm"
              style={{
                WebkitTextStroke: "2px #000",
                textShadow: "4px 4px 0px #f4f4f5",
              }}
            >
              RACE
            </span>
          </h2>

          <div className="w-16 h-2 bg-black mt-6 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">
              Event Name
            </label>
            <input
              required
              placeholder="e.g. FYTRR Mumbai 2026"
              className="w-full bg-zinc-50 border-2 border-zinc-100 p-5 rounded-2xl font-black text-zinc-900 placeholder:text-zinc-300 focus:border-black focus:bg-white outline-none transition-all"
              onChange={handleNameChange}
              value={formData.name}
            />
          </div>

          {/* Event Slug */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">
              Event Slug (URL)
            </label>
            <input
              required
              placeholder="fytrr-mumbai-2026"
              className="w-full bg-zinc-50 border-2 border-zinc-100 p-5 rounded-2xl font-mono text-sm font-bold text-brand-success placeholder:text-zinc-300 focus:border-black focus:bg-white outline-none transition-all"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>

          {/* Location & Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">
                Location
              </label>
              <input
                required
                placeholder="Mumbai, MH"
                className="w-full bg-zinc-50 border-2 border-zinc-100 p-5 rounded-2xl font-black text-zinc-900 placeholder:text-zinc-300 focus:border-black focus:bg-white outline-none transition-all"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">
                Event Date
              </label>
              <input
                required
                type="date"
                className="w-full bg-zinc-50 border-2 border-zinc-100 p-5 rounded-2xl font-black text-zinc-900 focus:border-black focus:bg-white outline-none transition-all appearance-none"
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 order-2 md:order-1 border-2 border-zinc-100 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all text-zinc-400 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 order-1 md:order-2 bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all hover:bg-brand-success hover:text-black disabled:opacity-50"
            >
              {loading ? "INITIALIZING..." : "Confirm & Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
