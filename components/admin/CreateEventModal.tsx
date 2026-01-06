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
    // Fixed inset-0 se ye hamesha screen ke center mein rahega
    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-20 bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative animate-in slide-in-from-top-10 duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-400 hover:text-black font-bold text-xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black italic uppercase mb-8">
          Deploy <span className="text-zinc-400">Race</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">
              Event Name
            </label>
            <input
              required
              placeholder="FYTRR Run 2026"
              className="w-full border-2 p-4 rounded-2xl font-bold focus:border-black outline-none"
              onChange={handleNameChange}
              value={formData.name}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">
              Event Slug (URL)
            </label>
            <input
              required
              placeholder="fytrr-run-2026"
              className="w-full border-2 p-4 rounded-2xl font-mono text-sm focus:border-black outline-none"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">
                Location
              </label>
              <input
                required
                placeholder="City, State"
                className="w-full border-2 p-4 rounded-2xl outline-none"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">
                Date
              </label>
              <input
                required
                type="date"
                className="w-full border-2 p-4 rounded-2xl outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 py-4 rounded-2xl font-black uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
            >
              {loading ? "SAVING..." : "Confirm & Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
