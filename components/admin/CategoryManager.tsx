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
    <div className="space-y-6 pt-6 border-t border-zinc-800">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
        Live Categories
      </h4>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center bg-zinc-800 p-3 rounded-xl border border-zinc-700"
          >
            <div>
              <p className="text-sm font-bold uppercase italic text-white">
                {cat.name}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase">
                Prefix: {cat.bib_prefix} • Price: ₹{cat.price}
              </p>
            </div>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-red-500 hover:bg-red-900/20 p-2 rounded-lg transition-all"
            >
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
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add Category Form */}
      <form onSubmit={addCategory} className="grid grid-cols-3 gap-2 pt-2">
        <input
          placeholder="Name (10KM)"
          className="bg-black border border-zinc-700 p-2 rounded-lg text-[10px] text-white outline-none focus:border-zinc-500"
          value={newCat.name}
          onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
          required
        />
        <input
          placeholder="Prefix (W-)"
          className="bg-black border border-zinc-700 p-2 rounded-lg text-[10px] text-white outline-none focus:border-zinc-500"
          value={newCat.bib_prefix}
          onChange={(e) =>
            setNewCat({ ...newCat, bib_prefix: e.target.value.toUpperCase() })
          }
          required
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Price"
            className="flex-1 bg-black border border-zinc-700 p-2 rounded-lg text-[10px] text-white outline-none focus:border-zinc-500"
            value={newCat.price || ""}
            onChange={(e) =>
              setNewCat({ ...newCat, price: parseInt(e.target.value) })
            }
            required
          />
          <button
            disabled={loading}
            className="bg-white text-black px-3 rounded-lg text-[10px] font-black uppercase hover:bg-zinc-200 transition-all"
          >
            {loading ? "..." : "+"}
          </button>
        </div>
      </form>
    </div>
  );
}
