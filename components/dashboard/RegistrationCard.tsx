import Link from "next/link";

interface RegistrationCardProps {
  reg: {
    id: string;
    status: string;

    // ✅ OBJECT (not array)
    events: {
      name: string;
      slug: string;
    } | null;

    // ✅ OBJECT (not array)
    categories: {
      name: string;
      price: number;
    } | null;

    participants: {
      id: string;
      participant_name: string;
      bib_number: string | null;
    }[];
  };
}

export const RegistrationCard = ({ reg }: RegistrationCardProps) => {
  const isPaid = reg.status === "paid";

  // ✅ Correct access (NO [0])
  const event = reg.events;
  const category = reg.categories;

  const unitPrice = category?.price ?? 0;
  const participantCount = reg.participants.length;
  const totalPrice = unitPrice * participantCount;

  return (
    <div
      className="group relative bg-white
      border border-zinc-200
      rounded-[2.5rem]
      overflow-hidden
      shadow-[0_40px_90px_rgba(0,0,0,0.35)]
      transition-all duration-500
      hover:shadow-[0_60px_120px_rgba(0,0,0,0.45)]
      hover:-translate-y-1"
    >
      {/* STATUS BAR */}
      <div
        className={`absolute top-0 left-0 right-0 h-2.5 ${
          isPaid ? "bg-brand-success" : "bg-orange-500"
        }`}
      />

      <div className="p-8 md:p-12 space-y-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="space-y-6 w-full lg:w-2/3">
            <div className="flex items-center gap-4">
              <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-brand-success shadow-sm">
                {reg.status}
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                Protocol: #{reg.id.slice(0, 8)}
              </span>
            </div>

            {/* EVENT + CATEGORY */}
            <div>
              <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight text-zinc-950 leading-[0.95]">
                {event?.name ?? "Event"}
              </h3>

              <p className="text-lg md:text-2xl font-black italic uppercase text-zinc-400 mt-2 tracking-wide">
                {category?.name ?? "Category"}
              </p>
            </div>
          </div>

          {/* PRICE */}
          <div
            className="relative bg-white px-10 py-10 rounded-[2rem]
            border border-black/10
            text-center flex flex-col justify-center
            shadow-inner overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none
              bg-[radial-gradient(circle_at_top_right,black,transparent_65%)]"
            />

            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-3 relative z-10">
              Registration Fee
            </p>
            <p className="text-3xl md:text-5xl font-black italic text-zinc-950 relative z-10">
              ₹{totalPrice}
            </p>
          </div>
        </div>

        {/* ATHLETES */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reg.participants.map((p) => (
            <div
              key={p.id}
              className="group/item flex justify-between items-center
              bg-zinc-50 border border-zinc-100
              p-7 rounded-[1.5rem]
              transition-all
              hover:bg-white
              hover:shadow-md"
            >
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                  Athlete
                </p>
                <p className="text-lg font-black italic uppercase text-zinc-950 group-hover/item:text-brand-success transition-colors">
                  {p.participant_name}
                </p>
              </div>

              {isPaid && p.bib_number ? (
                <div
                  className="bg-zinc-950 text-white
                  px-6 py-3 rounded-2xl
                  font-black text-lg
                  tracking-widest
                  shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  transform group-hover/item:rotate-3 transition-transform"
                >
                  {p.bib_number}
                </div>
              ) : (
                <span className="text-orange-600 text-xs font-black uppercase">
                  Processing
                </span>
              )}
            </div>
          ))}
        </div>

        {/* RESULTS */}
        {isPaid && event?.slug && (
          <Link
            href={`/event/${event.slug}/results`}
            className="group relative block text-center
            bg-zinc-950 text-white
            py-7 rounded-[1.5rem]
            font-black uppercase tracking-[0.3em] text-sm
            transition-all overflow-hidden
            hover:bg-brand-success hover:text-black"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <span className="relative z-10">View Official Results →</span>
          </Link>
        )}
      </div>
    </div>
  );
};
