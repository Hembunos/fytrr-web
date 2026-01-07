export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-brand-success selection:text-black font-sans overflow-x-hidden">
      {/* ⬛ Giant Decorative Background Text */}
      <div className="absolute top-0 right-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="text-[15rem] md:text-[30rem] font-black italic uppercase text-white tracking-tighter -rotate-12 translate-x-1/4">
          REFUND
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-20 md:space-y-32 relative z-10">
        {/* Header Section */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Financial Protocol
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Refund <br /> <span className="text-white/10">Policy</span>
          </h1>
          <p className="text-white/40 uppercase font-black tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-xs border-l-2 border-brand-success pl-4 max-w-sm leading-relaxed">
            Financial Transparency • FYTRR ORG 2026
          </p>
        </div>

        {/* Policy Content Blocks */}
        <div className="grid grid-cols-1 gap-10 md:gap-14 pb-20">
          {/* Section 1: Participant Cancellation */}
          <div className="p-8 md:p-14 bg-white/[0.03] border border-white/5 rounded-race space-y-6 transition-all hover:border-white/20">
            <div className="flex items-center gap-5">
              <span className="h-3 w-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-white/40">
                01. Participant Cancellation
              </h2>
            </div>
            <p className="text-white/60 font-black leading-relaxed uppercase text-[10px] md:text-xs tracking-[0.2em] max-w-2xl">
              Registrations are generally{" "}
              <span className="text-white italic underline decoration-orange-500 decoration-2 underline-offset-4">
                non-refundable
              </span>
              . However, cancellations made 30 days prior to the event date (Feb
              15, 2026) may be eligible for a 50% refund to cover administrative
              costs.
            </p>
          </div>

          {/* Section 2: Event Cancellation */}
          <div className="p-8 md:p-14 bg-white/[0.03] border border-white/5 rounded-race space-y-6 transition-all hover:border-white/20">
            <div className="flex items-center gap-5">
              <span className="h-3 w-3 bg-brand-success rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-white/40">
                02. Event Cancellation
              </h2>
            </div>
            <p className="text-white/60 font-black leading-relaxed uppercase text-[10px] md:text-xs tracking-[0.2em] max-w-2xl">
              In the rare case that the event is cancelled due to unforeseen
              circumstances or government regulations,{" "}
              <span className="text-brand-success italic">FYTRR ORG</span> will
              provide a 100% refund or offer a priority transfer to a future
              race date.
            </p>
          </div>

          {/* Section 3: Processing Window (High Contrast White Card) */}
          <div className="p-8 md:p-14 bg-white text-black rounded-race shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-t-[10px] border-black transition-all hover:scale-[1.01] duration-500">
            <div className="flex items-center gap-5 mb-6">
              <span className="h-3 w-3 bg-black rounded-full" />
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
                03. Processing Window
              </h2>
            </div>
            <p className="text-black/60 text-xs md:text-sm font-black uppercase leading-relaxed tracking-widest italic border-l-2 border-black/10 pl-5">
              Approved refunds are processed through{" "}
              <span className="text-black underline decoration-black decoration-2 underline-offset-4 font-black">
                Razorpay
              </span>{" "}
              and typically reflect in your original payment method within 7-10
              working days.
            </p>
          </div>
        </div>

        {/* Support Footer */}
        <div className="text-center pt-12 border-t border-white/5 pb-20">
          <p className="text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] italic">
            Questions? Contact support@fytrr.in • FYTRR 2026
          </p>
        </div>
      </div>
    </div>
  );
}
