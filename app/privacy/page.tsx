export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-white selection:text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Privacy <br /> <span className="text-zinc-800">Policy</span>
          </h1>
          <p className="text-zinc-500 uppercase font-black tracking-[0.4em] text-[10px]">
            Data Protection Protocol • FYTRR ORG
          </p>
        </div>

        {/* Policy Content Blocks */}
        <div className="grid grid-cols-1 gap-4">
          {/* Section 1: Data Collection */}
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-4 transition-all hover:border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                01. Data Collection
              </h2>
            </div>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Hum aapka personal data jaise{" "}
              <span className="text-white">
                Name, Email, aur Athlete details
              </span>{" "}
              sirf registration aur timing purposes ke liye collect karte hain.
              Humara maqsad sirf aapko ek seamless race experience dena hai.
            </p>
          </div>

          {/* Section 2: Payment Security (High Contrast) */}
          <div className="p-10 bg-white text-black rounded-[2.5rem] space-y-4 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-black rounded-full" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                02. Payment Security
              </h2>
            </div>
            <p className="text-zinc-700 font-bold leading-relaxed uppercase text-xs">
              Aapki payment <span className="italic underline">Razorpay</span>{" "}
              ke encrypted servers par process hoti hai.{" "}
              <span className="bg-black text-white px-2 py-0.5">FYTRR ORG</span>{" "}
              aapke credit card ya banking credentials kabhi store nahi karta.
            </p>
          </div>

          {/* Section 3: Third-Party Sharing */}
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-4 transition-all hover:border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-zinc-500 rounded-full" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                03. Zero Data Sale
              </h2>
            </div>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Aapka data kabhi bhi sell nahi kiya jata. Ye sirf un{" "}
              <span className="text-white italic">Essential Partners</span>{" "}
              (Timing crew/Medical team) ke saath share hota hai jo race execute
              karne ke liye zaroori hain.
            </p>
          </div>
        </div>

        {/* Support Footer */}
        <div className="text-center pt-8 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
            Privacy Guaranteed • FYTRR 2026
          </p>
        </div>
      </div>
    </div>
  );
}
