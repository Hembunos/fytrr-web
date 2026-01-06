export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 py-20 space-y-8">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter">
        Privacy <span className="text-zinc-400">Policy</span>
      </h1>
      <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            1. Data Collection
          </h2>
          <p>
            We collect personal information such as name, email, and athlete
            details solely for registration and timing purposes for the Dumka
            event.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            2. Payment Security
          </h2>
          <p>
            Payment information is processed securely via Razorpay. [FYTRR ORG]
            does not store your credit card or banking credentials on our
            servers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black uppercase">
            3. Third-Party Sharing
          </h2>
          <p>
            Your data is never sold. It is only shared with essential timing and
            safety partners required to execute the race event.
          </p>
        </section>
      </div>
    </div>
  );
}
