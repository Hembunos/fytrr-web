import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServer();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .limit(1);

  const event = events?.[0];

  if (!event) {
    return <div className="p-6">No active events</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fytrr</h1>

      <div className="border p-4 rounded">
        <h2 className="text-xl">{event.name}</h2>
        <p>{event.location}</p>
        <p>{event.event_date}</p>

        <Link
          href={`/event/${event.slug}`}
          className="block mt-4 bg-black text-white text-center p-2"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
}
