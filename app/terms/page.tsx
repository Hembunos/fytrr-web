export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-white selection:text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Terms & <br /> <span className="text-zinc-800">Conditions</span>
          </h1>
          <p className="text-zinc-500 uppercase font-black tracking-[0.4em] text-[10px]">
            The Rules of Engagement • FYTRR ORG 2026
          </p>
        </div>

        {/* Terms Content Blocks */}
        <div className="grid grid-cols-1 gap-4">
          {/* Section 1: Participation */}
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-4 transition-all hover:border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                01. Event Participation
              </h2>
            </div>
            <p className="text-zinc-500 font-medium leading-relaxed">
              FYTRR RUN 2026 mein register karke, aap sabhi{" "}
              <span className="text-white italic underline">
                safety guidelines
              </span>{" "}
              aur rules ko manne ke liye sehmat hain. Race mein bhag lena poori
              tarah se athlete ke apne risk par hai.
            </p>
          </div>

          {/* Section 2: Registration & BIBs (High Contrast) */}
          <div className="p-10 bg-white text-black rounded-[2.5rem] space-y-4 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-black rounded-full" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                02. BIB Ownership
              </h2>
            </div>
            <p className="text-zinc-700 font-bold leading-relaxed uppercase text-xs">
              BIB numbers (jaise <span className="italic underline">B-101</span>
              ) non-transferable hain. Registration sirf us individual ke liye
              valid hai jiske naam par wo entry hui hai. Race ke waqt BIB
              hamesha visible honi chahiye.
            </p>
          </div>

          {/* Section 3: Media Waiver */}
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-4 transition-all hover:border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-zinc-500 rounded-full" />
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                03. Media Waiver
              </h2>
            </div>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Event ke dauran liye gaye{" "}
              <span className="text-white italic">Photographs aur Videos</span>{" "}
              ko FYTRR ORG apne promotional purposes (Social Media/Ads) ke liye
              use karne ka adhikaar rakhta hai.
            </p>
          </div>
        </div>

        {/* Final Disclaimer */}
        <div className="text-center pt-8 border-t border-zinc-900">
          <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800">
            Play Hard • Follow Rules
          </p>
        </div>
      </div>
    </div>
  );
}
