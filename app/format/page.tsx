export default function RaceFormat() {
  const formats = [
    {
      title: "BIB Assignment",
      desc: "Har runner ko ek unique alpha-numeric BIB milega (e.g., B-101) jo unki category ko define karega. Registration ke turant baad dashboard par ye dikhne lagega.",
    },
    {
      title: "Timing System",
      desc: "Official race clock start gun ke saath shuru hogi. Finish line par accurate manual aur digital entry se rankings taiyar hoti hain.",
    },
    {
      title: "Result Logic",
      desc: "Top 3 winners ko podium results page par highlight kiya jata hai. Aapka official time finish line cross karte hi system mein record ho jata hai.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-brand-success selection:text-black font-sans overflow-x-hidden">
      {/* ⬛ Giant Decorative Background Text - Consistent with Dashboard/Archive */}
      <div className="absolute top-0 right-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="text-[15rem] md:text-[30rem] font-black italic uppercase text-white tracking-tighter -rotate-12 translate-x-1/4 translate-y-1/4">
          FORMAT
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-20 md:space-y-32 relative z-10">
        {/* Header Section: Synced with Layout Typography */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Race Manual
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Race <span className="text-white/10 font-black">Format</span>
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 md:w-20 bg-white/10" />
            <p className="text-white/40 uppercase font-black tracking-[0.4em] text-[10px] whitespace-nowrap italic">
              Rules of the Road • FYTRR Official
            </p>
            <div className="h-px w-12 md:w-20 bg-white/10" />
          </div>
        </div>

        {/* Formats List: Industry-Grade Cards */}
        <div className="space-y-8 md:space-y-12">
          {formats.map((f, i) => (
            <div
              key={i}
              className="group p-8 md:p-14 bg-white/[0.03] border border-white/5 rounded-race flex flex-col md:flex-row gap-10 items-start transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <span className="text-6xl md:text-8xl font-black text-white/5 italic leading-none group-hover:text-brand-success transition-all duration-500 group-hover:scale-110">
                0{i + 1}
              </span>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                  {f.title}
                </h3>
                <p className="text-white/40 text-xs md:text-sm font-black uppercase leading-relaxed tracking-[0.15em] italic">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer: High Contrast "POP" Card */}
        <div className="bg-white text-black p-10 md:p-16 rounded-race space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-l-[12px] border-black transition-all hover:scale-[1.01] duration-500">
          <div className="flex items-center gap-5">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-xl rotate-3">
              <span className="text-2xl">🛡️</span>
            </div>
            <h4 className="font-black uppercase italic text-2xl md:text-4xl tracking-tighter">
              Safety & Protocol
            </h4>
          </div>
          <p className="text-[11px] md:text-xs font-black leading-loose uppercase tracking-widest italic border-l-2 border-black/10 pl-6">
            Runner safety hamari priority hai. Medical stations har 2KM par
            available honge. Bina official BIB ke race track par entry strictly
            prohibited hai. Race day par timing chip aur BIB visible hona
            chahiye.
          </p>
        </div>

        {/* Bottom Decorative Branding */}
        <div className="text-center pt-10 border-t border-white/5 pb-20">
          <p className="text-[10px] font-black uppercase tracking-[1em] text-white/10 italic">
            Stay Focused • Finish Strong
          </p>
        </div>
      </div>
    </div>
  );
}
