import Link from "next/link";

export const EmptyTrackView = () => {
  return (
    <div className="py-24 bg-white border border-brand-accent/5 rounded-race shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-center space-y-8 animate-in fade-in zoom-in duration-700">
      {/* Icon or Decorative Element */}
      <div className="flex justify-center">
        <div className="h-24 w-24 bg-brand-accent/5 rounded-full flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-brand-accent/20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.362 5.214A8.252 8.252 0 0112 21.75a8.25 8.25 0 01-4.5-1.285m8.592-15.251A8.25 8.25 0 0121.75 12c0 1.268-.286 2.47-.793 3.545m-12.135-4.77l.001-.001m0 0a.75.75 0 011.06 0l.001.001M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12l-2.25 2.25m0 0l2.25 2.25m-2.25-2.25l-2.25-2.25m0 0L9 14.25"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-brand-accent/10 font-black uppercase italic tracking-tighter text-4xl md:text-6xl">
          Empty Track
        </p>
        <p className="text-brand-accent/40 text-[10px] font-black uppercase tracking-[0.2em]">
          You haven't signed up for any battles yet.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block bg-brand-primary text-brand-secondary px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-success hover:text-brand-primary transition-all shadow-xl active:scale-95 group"
      >
        <span className="flex items-center gap-2">
          Explore Races
          <span className="group-hover:translate-x-2 transition-transform">
            →
          </span>
        </span>
      </Link>
    </div>
  );
};
