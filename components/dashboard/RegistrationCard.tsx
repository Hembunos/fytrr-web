import Link from "next/link";

export const RegistrationCard = ({ reg }) => {
  const isPaid = reg.status === "paid";
  const totalPrice = reg.categories?.price * (reg.participants?.length || 1);

  return (
    <div className="group relative bg-white border border-white/10 rounded-race overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.4)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all duration-500">
      {/* ⚡ Status Indicator Bar - FIXED ALIGNMENT */}
      <div
        className={`absolute top-0 left-0 right-0 h-2.5 z-10 ${
          isPaid ? "bg-brand-success" : "bg-orange-500"
        }`}
      />

      {/* Main Content Area - Added pt-12 to compensate for the absolute bar */}
      <div className="p-6 md:p-12 pt-10 md:pt-16 space-y-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  isPaid
                    ? "bg-green-50 text-brand-success border border-green-100"
                    : "bg-orange-50 text-orange-600 border border-orange-100"
                }`}
              >
                {reg.status}
              </span>
              <span className="text-[10px] text-black/30 font-black uppercase tracking-widest">
                ID: #{reg.id.slice(0, 8)}
              </span>
            </div>

            <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.8] text-black">
              {reg.events?.name} <br />
              <span className="text-black/10 text-2xl md:text-4xl block mt-2">
                {reg.categories?.name}
              </span>
            </h3>
          </div>

          {/* 💰 Fee Summary Module */}
          <div className="bg-[#F8F9FA] px-10 py-8 rounded-3xl border border-black/5 w-full lg:w-auto text-center lg:text-right shadow-inner">
            <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] mb-2">
              Registration Fee
            </p>
            <p className="text-3xl md:text-5xl font-black italic tracking-tighter text-black">
              ₹{totalPrice}
            </p>
          </div>
        </div>

        {/* 🏃 Athlete Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {reg.participants?.map((p) => (
            <div
              key={p.id}
              className="group/athlete flex justify-between items-center bg-[#fcfcfc] border border-black/5 p-6 rounded-3xl hover:border-black transition-all shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">
                  Athlete
                </p>
                <p className="text-lg font-black italic uppercase text-black leading-tight group-hover/athlete:text-brand-success transition-colors">
                  {p.participant_name}
                </p>
              </div>
              {isPaid && p.bib_number ? (
                <div className="bg-black text-white text-xl font-black px-5 py-2.5 rounded-2xl shadow-lg transform group-hover/athlete:rotate-3 transition-transform">
                  {p.bib_number}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-orange-600 italic">
                    Processing
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 🏁 Results Action Button */}
        {isPaid && (
          <Link
            href={`/event/${reg.events?.slug}/results`}
            className="flex items-center justify-center w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-success hover:text-black transition-all shadow-2xl group"
          >
            Official Results{" "}
            <span className="ml-3 group-hover:translate-x-3 transition-transform">
              →
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};