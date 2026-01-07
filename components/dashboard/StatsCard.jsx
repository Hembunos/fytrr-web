export const StatsCard = ({
  title,
  value,
  type = "primary",
  animateDelay = "",
}) => {
  const isSuccess = type === "success";

  return (
    <div
      className={`relative bg-white border border-white/10 p-6 md:p-10 rounded-race shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between group transition-all duration-500 hover:-translate-y-1 overflow-hidden ${animateDelay}`}
    >
      {/* ⚡ Dynamic Top Accent Line */}
      <div
        className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${
          isSuccess
            ? "bg-brand-success shadow-[0_0_15px_rgba(34,197,94,0.4)]"
            : "bg-black"
        }`}
      />

      <div className="space-y-4">
        {/* Title: Synced with Layout Label Style */}
        <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] italic leading-none">
          {title}
        </p>

        {/* Value: Aggressive Racing Font Style */}
        <p
          className={`text-5xl md:text-6xl font-black italic leading-none transition-all duration-500 group-hover:tracking-tighter ${
            isSuccess ? "text-brand-success" : "text-black"
          }`}
        >
          {value.toString().padStart(2, "0")}
        </p>
      </div>

      {/* Subtle Background Icon Decoration (Optional - looks pro) */}
      <div className="absolute -bottom-2 -right-2 opacity-[0.03] pointer-events-none select-none group-hover:scale-110 transition-transform duration-700">
        <span className="text-8xl font-black italic uppercase text-black">
          {title.charAt(0)}
        </span>
      </div>
    </div>
  );
};