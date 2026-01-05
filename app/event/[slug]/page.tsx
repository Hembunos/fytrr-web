import { createSupabaseServer } from "@/lib/supabase/server";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // 🔥 THIS IS THE FIX

  const supabase = await createSupabaseServer();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold">Event not found</h1>
        <p className="text-zinc-500">Invalid event URL</p>
      </div>
    );
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("event_id", event.id);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-2">{event.name}</h1>
      <p>{event.location}</p>

      <div className="mt-4 space-y-2">
        {categories?.map((cat) => (
          <div key={cat.id} className="border p-3">
            <div className="flex justify-between">
              <span>{cat.name}</span>
              <span>₹{cat.price}</span>
            </div>
            <a
              href={`/register?category=${cat.id}`}
              className="block mt-2 text-center bg-black text-white p-1"
            >
              Select
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
