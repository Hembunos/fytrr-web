export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-brand-success selection:text-black font-sans overflow-x-hidden">
      {/* ⬛ Giant Decorative Background Text - Synced with Dashboard/Results */}
      <div className="absolute top-0 right-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="text-[15rem] md:text-[30rem] font-black italic uppercase text-white tracking-tighter -rotate-12 translate-x-1/4">
          LEGAL
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-20 md:space-y-32 relative z-10">
        {/* Header Section: Synced with Layout Typography */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Official Protocol
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Terms & <br />{" "}
            <span className="text-white/10 font-black">Conditions</span>
          </h1>
          <p className="text-white/40 uppercase font-black tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-xs border-l-2 border-brand-success pl-4 max-w-sm">
            The Rules of Engagement • FYTRR ORG 2026
          </p>
        </div>

        {/* Terms Content Blocks */}
        <div className="grid grid-cols-1 gap-10 md:gap-14 pb-20">
          {/* Section 1: Event Participation (Solid White "POP" Card) */}
          <div className="p-8 md:p-14 bg-white text-black rounded-race shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-t-[10px] border-black transition-all hover:scale-[1.01] duration-500">
            <div className="flex items-center gap-5 mb-6">
              <span className="h-3 w-3 bg-brand-success rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
                01. Event Participation
              </h2>
            </div>
            <p className="text-black/60 text-xs md:text-sm font-black uppercase leading-relaxed tracking-widest italic border-l-2 border-black/10 pl-5">
              FYTRR RUN 2026 mein register karke, aap sabhi{" "}
              <span className="text-black underline decoration-brand-success decoration-4 underline-offset-4 font-black">
                safety guidelines
              </span>{" "}
              aur rules ko manne ke liye sehmat hain. Race mein bhag lena poori
              tarah se athlete ke apne risk par hai.
            </p>
          </div>

          {/* Section 2: BIB Ownership (Subtle Dark Card) */}
          <div className="p-8 md:p-14 bg-white/[0.03] border border-white/5 rounded-race space-y-6 transition-all hover:border-white/20">
            <div className="flex items-center gap-5">
              <span className="h-3 w-3 bg-white/20 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-white/40">
                02. BIB Ownership
              </h2>
            </div>
            <p className="text-white/60 font-black leading-relaxed uppercase text-[10px] md:text-xs tracking-[0.2em] max-w-2xl">
              BIB numbers (jaise{" "}
              <span className="text-white italic underline decoration-2 underline-offset-4">
                B-101
              </span>
              ) non-transferable hain. Registration sirf us individual ke liye
              valid hai jiske naam par wo entry hui hai. Race ke waqt BIB
              hamesha visible honi chahiye.
            </p>
          </div>

          {/* Section 3: Media Waiver (Subtle Dark Card) */}
          <div className="p-8 md:p-14 bg-white/[0.03] border border-white/5 rounded-race space-y-6 transition-all hover:border-white/20">
            <div className="flex items-center gap-5">
              <span className="h-3 w-3 bg-white/20 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-white/40">
                03. Media Waiver
              </h2>
            </div>
            <p className="text-white/60 font-black leading-relaxed uppercase text-[10px] md:text-xs tracking-[0.2em] max-w-2xl">
              Event ke dauran liye gaye{" "}
              <span className="text-brand-success italic underline underline-offset-4 font-black">
                Photographs aur Videos
              </span>{" "}
              ko FYTRR ORG apne promotional purposes (Social Media/Ads) ke liye
              use karne ka adhikaar rakhta hai.
            </p>
          </div>
        </div>

        {/* Final Disclaimer: Synced with Layout Footer vibe */}
        <div className="text-center pt-12 border-t border-white/5 pb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 italic">
            Play Hard • Follow Rules • FYTRR 2026
          </p>
        </div>
      </div>
    </div>
  );
}
