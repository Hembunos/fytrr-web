export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 py-20 space-y-8">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter">
        Refund <span className="text-zinc-400">Policy</span>
      </h1>
      <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            1. Cancellation by Participant
          </h2>
          <p>
            Registrations are generally non-refundable. However, cancellations
            made 30 days prior to the event date (Feb 15, 2026) may be eligible
            for a 50% refund.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            2. Event Cancellation
          </h2>
          <p>
            If the event is cancelled due to unforeseen circumstances or
            government regulations, [FYTRR ORG] will provide a full refund or
            carry forward the registration to a future date.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            3. Refund Processing
          </h2>
          <p>
            Approved refunds will be processed back to the original payment
            method via Razorpay within 7-10 working days.
          </p>
        </section>
      </div>
    </div>
  );
}
