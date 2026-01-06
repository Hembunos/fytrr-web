export default function RaceFormat() {
  const formats = [
    {
      title: "BIB Assignment",
      desc: "Har runner ko ek unique alpha-numeric BIB milega (e.g., B-101) jo unki category ko define karega.",
    },
    {
      title: "Timing System",
      desc: "Official race clock start gun ke sath shuru hogi. Finish line par accurate manual entries se rankings taiyar hoti hain.",
    },
    {
      title: "Result Logic",
      desc: "Top 3 winners ko podium results page par highlight kiya jata hai based on finish time.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
            Race <span className="text-zinc-800">Format</span>
          </h1>
          <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-[10px] mt-4">
            Rules of the Road • FYTRR Official
          </p>
        </div>

        <div className="space-y-4">
          {formats.map((f, i) => (
            <div
              key={i}
              className="p-10 bg-zinc-950 rounded-[2.5rem] border border-zinc-900 flex flex-col md:flex-row gap-8 items-start"
            >
              <span className="text-5xl font-black text-zinc-800 italic">
                0{i + 1}
              </span>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase italic tracking-tight">
                  {f.title}
                </h3>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-white text-black p-8 rounded-[2rem] space-y-4">
          <h4 className="font-black uppercase italic text-sm">
            Safety & Protocol
          </h4>
          <p className="text-xs font-bold leading-tight uppercase opacity-70">
            Runner safety hamari priority hai. Medical stations har 2KM par
            available honge. No BIB, No Race.
          </p>
        </div>
      </div>
    </div>
  );
}
