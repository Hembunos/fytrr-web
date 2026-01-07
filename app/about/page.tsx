import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-brand-success selection:text-black font-sans overflow-x-hidden">
      {/* ⬛ Giant Decorative Background Text - Consistent with Dashboard */}
      <div className="absolute top-0 right-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center overflow-hidden h-full w-full">
        <div className="text-[15rem] md:text-[30rem] font-black italic uppercase text-white tracking-tighter -rotate-12 translate-x-1/4">
          CULTURE
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-20 md:space-y-32 relative z-10 pt-10">
        {/* Hero Section: Aggressive Branding */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Est. 2026
          </div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">
            Beyond <br />{" "}
            <span className="text-white/10 font-black">Limits.</span>
          </h1>
          <p className="text-white/40 uppercase font-black tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-xs border-l-2 border-brand-success pl-4 max-w-sm italic">
            The Story of FYTRR • Performance Protocol
          </p>
        </div>

        {/* Vision Content: Sharp Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-16">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic text-brand-success">
              Our DNA
            </h2>
            <p className="text-white/50 leading-relaxed font-black uppercase text-[11px] md:text-xs tracking-widest italic">
              FYTRR koi sirf marathon company nahi hai. Hum ek community hain un
              logo ki jo har din apne kal se behtar banna chahte hain. Hamara
              maqsad running ko ek lifestyle banana hai.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic text-brand-success">
              The Mission
            </h2>
            <p className="text-white/50 leading-relaxed font-black uppercase text-[11px] md:text-xs tracking-widest italic">
              Ground zero se lekar elite levels tak, hum runners ko wo platform
              dete hain jahan sirf timing matter karti hai. No excuses, just
              pace. We define the road.
            </p>
          </div>
        </div>

        {/* Values: Solid White "POP" Cards for Contrast */}
        <div className="grid grid-cols-1 gap-6">
          {["Pace", "Grit", "Community"].map((val, i) => (
            <div
              key={val}
              className="group p-10 md:p-14 bg-white text-black rounded-race shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-l-[10px] border-black transition-all duration-500 hover:scale-[1.02] flex justify-between items-center"
            >
              <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter group-hover:tracking-normal transition-all duration-500">
                {val}
              </h3>
              <span className="text-black/10 text-5xl md:text-7xl font-black italic">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Action Link: Synced with Layout CTA Style */}
        <div className="pt-10 border-t border-white/5 pb-20">
          <Link
            href="/"
            className="inline-block text-[11px] font-black border-b-2 border-brand-success pb-2 uppercase italic tracking-[0.3em] hover:text-brand-success transition-all"
          >
            ← Back to the track
          </Link>
        </div>
      </div>
    </div>
  );
}
