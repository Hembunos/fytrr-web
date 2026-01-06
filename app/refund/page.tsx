export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-white selection:text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Refund <br /> <span className="text-zinc-800">Policy</span>
          </h1>
          <p className="text-zinc-500 uppercase font-black tracking-[0.4em] text-[10px]">
            Financial Transparency • FYTRR ORG
          </p>
        </div>

        {/* Policy Content */}
        <div className="grid grid-cols-1 gap-4">
          {/* Section 1 */}
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-4 transition-all hover:border-zinc-700">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                01. Participant Cancellation
              </h2>
            </div>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Registrations are generally{" "}
              <span className="text-white font-bold italic">
                non-refundable
              </span>
              . However, cancellations made 30 days prior to the event date (Feb
              15, 2026) may be eligible for a 50% refund to cover administrative
              costs.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-4 transition-all hover:border-zinc-700">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                02. Event Cancellation
              </h2>
            </div>
            <p className="text-zinc-500 font-medium leading-relaxed">
              In the rare case that the event is cancelled due to unforeseen
              circumstances or government regulations,{" "}
              <span className="text-white font-bold italic">FYTRR ORG</span>{" "}
              will provide a 100% refund or offer a priority transfer to a
              future race date.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-10 bg-white text-black rounded-[2.5rem] space-y-4 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-black rounded-full" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                03. Processing Window
              </h2>
            </div>
            <p className="text-zinc-700 font-bold leading-relaxed uppercase text-xs">
              Approved refunds are processed through{" "}
              <span className="italic underline">Razorpay</span> and typically
              reflect in your original payment method within 7-10 working days.
            </p>
          </div>
        </div>

        {/* Support Footer */}
        <div className="text-center pt-8">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
            Questions? Contact support@fytrr.in
          </p>
        </div>
      </div>
    </div>
  );
}
