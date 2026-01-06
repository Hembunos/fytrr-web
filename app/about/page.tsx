import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto space-y-20">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Beyond <br /> <span className="text-zinc-800">Limits.</span>
          </h1>
          <p className="text-zinc-500 uppercase font-black tracking-[0.4em] text-xs">
            The Story of FYTRR • Est. 2026
          </p>
        </div>

        {/* Vision Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-900 pt-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic italic">
              Our DNA
            </h2>
            <p className="text-zinc-400 leading-relaxed font-medium">
              FYTRR koi sirf marathon company nahi hai. Hum ek community hain un
              logo ki jo har din apne kal se behtar banna chahte hain. Hamara
              maqsad running ko ek lifestyle banana hai.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic">
              The Mission
            </h2>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Ground zero se lekar elite levels tak, hum runners ko wo platform
              dete hain jahan sirf timing matter karti hai. No excuses, just
              pace.
            </p>
          </div>
        </div>

        {/* Values - FYTRR Style Cards */}
        <div className="grid grid-cols-1 gap-4">
          {["Pace", "Grit", "Community"].map((val) => (
            <div
              key={val}
              className="p-8 border-2 border-zinc-900 rounded-[2rem] hover:border-white transition-all group"
            >
              <h3 className="text-4xl font-black uppercase italic group-hover:tracking-widest transition-all">
                {val}
              </h3>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block text-[10px] font-black border-b-2 border-white pb-1 uppercase italic hover:opacity-50 transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
