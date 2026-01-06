import { createSupabaseServer } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";

export default async function PastEventsPage() {
  const supabase = await createSupabaseServer();

  // Filter for inactive events
  const { data: pastEvents, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", false)
    .order("event_date", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 mt-10">
      <div className="space-y-2">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase">
          Past <span className="text-zinc-400">Events</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs">
          The Hall of Fame
        </p>
      </div>

      {!pastEvents || pastEvents.length === 0 ? (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-3xl">
          <p className="text-zinc-400 font-medium italic">
            No past events found yet. The history is being written...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
