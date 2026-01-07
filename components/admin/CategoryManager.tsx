"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CategoryManager({
  eventId,
  initialCategories,
}: {
  eventId: string;
  initialCategories: any[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", price: 0, bib_prefix: "" });

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .insert([{ ...newCat, event_id: eventId }])
      .select()
      .single();

    if (!error) {
      setCategories([...categories, data]);
      setNewCat({ name: "", price: 0, bib_prefix: "" });
    }
    setLoading(false);
  };

  const deleteCategory = async (id: string) => {
    // Check if athletes are registered in this category before deleting [Safety Check]

    if (!confirm("Are you sure you want to delete this category?")) return;
    
    const { count } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (count && count > 0) {
      alert("Cannot delete: Athletes are already registered in this category!");
      return;
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-success italic">
          Live Protocols
        </h4>
        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
          {categories.length} Units
        </span>
      </div>

      {/* 📜 Categories List: Compact Scroll */}
      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center bg-white/[0.03] p-3 rounded-xl border border-white/5 group hover:border-brand-success/30 transition-all"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase italic text-white leading-none mb-1 truncate">
                {cat.name}
              </p>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-tight">
                PFX:{" "}
                <span className="text-brand-success">{cat.bib_prefix}</span> • ₹
                {cat.price}
              </p>
            </div>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-red-500/20 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all ml-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* ➕ Add Category: Ultra-Wide Compact Form */}
      <form
        onSubmit={addCategory}
        className="space-y-2 pt-3 border-t border-white/5"
      >
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Name (e.g. 10KM)"
            className="bg-black border border-white/10 p-3 rounded-lg text-[10px] font-black text-white outline-none focus:border-brand-success transition-all italic"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            required
          />
          <input
            placeholder="Prefix (W-)"
            className="bg-black border border-white/10 p-3 rounded-lg text-[10px] font-black text-white outline-none focus:border-brand-success transition-all"
            value={newCat.bib_prefix}
            onChange={(e) =>
              setNewCat({ ...newCat, bib_prefix: e.target.value.toUpperCase() })
            }
            required
          />
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Price (INR)"
            className="flex-1 bg-black border border-white/10 p-3 rounded-lg text-[10px] font-black text-white outline-none focus:border-brand-success transition-all"
            value={newCat.price || ""}
            onChange={(e) =>
              setNewCat({ ...newCat, price: parseInt(e.target.value) })
            }
            required
          />
          <button
            disabled={loading}
            className="bg-brand-success text-black px-6 py-3 rounded-lg text-[10px] font-black uppercase hover:scale-95 transition-all shadow-lg active:opacity-80"
          >
            {loading ? "..." : "ADD"}
          </button>
        </div>
      </form>
    </div>
  );
}
