export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 py-20 space-y-8">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter">
        Terms & <span className="text-zinc-400">Conditions</span>
      </h1>
      <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            1. Event Participation
          </h2>
          <p>
            By registering for FYTRR RUN 2026, participants agree to follow all
            safety guidelines and event rules provided by the organizers.
            Participation is at the athlete's own risk.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            2. Registration & BIBs
          </h2>
          <p>
            Registrations are unique to the individual. BIB numbers assigned
            (e.g., starting B-101) are non-transferable and must be visible at
            all times during the race.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            3. Media Waiver
          </h2>
          <p>
            Participants grant [FYTRR ORG] the right to use photographs and
            videos taken during the event for promotional purposes.
          </p>
        </section>
      </div>
    </div>
  );
}
