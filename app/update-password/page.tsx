// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// export default function UpdatePassword() {
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<{
//     type: "error" | "success";
//     msg: string;
//   } | null>(null);
//   const router = useRouter();

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus(null);

//     if (password.length < 6) {
//       return setStatus({
//         type: "error",
//         msg: "Password must be at least 6 characters",
//       });
//     }

//     setLoading(true);
//     // This updates the user's password in the current session established by the callback
//     const { error } = await supabase.auth.updateUser({
//       password: password,
//     });

//     setLoading(false);

//     if (error) {
//       setStatus({ type: "error", msg: error.message });
//     } else {
//       setStatus({ type: "success", msg: "Password updated! Redirecting..." });
//       // Short delay so they see the success message
//       setTimeout(() => {
//         router.push("/dashboard");
//         router.refresh();
//       }, 2000);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
//       <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-2xl rounded-[2.5rem] border border-zinc-100">
//         <div className="space-y-2">
//           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
//             Account Security
//           </div>
//           <h1 className="text-4xl font-black italic uppercase tracking-tighter italic">
//             Reset <span className="text-zinc-400">Password</span>
//           </h1>
//           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">
//             Enter a strong new password for your FYTRR account
//           </p>
//         </div>

//         {status && (
//           <div
//             className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
//               status.type === "error"
//                 ? "bg-red-50 text-red-500 border border-red-100"
//                 : "bg-green-50 text-green-600 border border-green-100"
//             }`}
//           >
//             {status.msg}
//           </div>
//         )}

//         <form onSubmit={handleUpdate} className="space-y-6">
//           <div className="relative group">
//             <input
//               type="password"
//               placeholder="••••••••"
//               className="w-full border-2 border-zinc-100 p-4 rounded-2xl focus:border-black outline-none transition-all font-bold placeholder:text-zinc-200"
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>

//           <button
//             disabled={loading}
//             className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-[0.98] shadow-xl shadow-zinc-200"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Updating...
//               </div>
//             ) : (
//               "Confirm New Password"
//             )}
//           </button>
//         </form>

//         <p className="text-[10px] text-zinc-400 text-center font-bold uppercase tracking-widest">
//           Secure Encrypted Session
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (password.length < 6) {
      return setStatus({
        type: "error",
        msg: "Password must be at least 6 characters",
      });
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setStatus({ type: "error", msg: error.message });
    } else {
      setStatus({ type: "success", msg: "Password updated! Redirecting..." });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black selection:bg-brand-success selection:text-black font-sans">
      {/* 🏁 Background Athletic Branding: Stealth Sync */}
      <div className="absolute inset-0 z-0 opacity-[0.02] select-none pointer-events-none flex flex-col justify-between p-10 md:p-20">
        <div className="text-[12rem] md:text-[25rem] font-black italic uppercase leading-none text-white self-start -translate-x-1/4">
          SHIELD
        </div>
        <div className="text-[12rem] md:text-[25rem] font-black italic uppercase leading-none text-white self-end translate-x-1/4">
          SECURE
        </div>
      </div>

      {/* 🛡️ Reset Card: White & High-Contrast */}
      <div className="z-10 w-full max-w-md p-8 md:p-14 space-y-12 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-race border-t-[8px] border-black animate-in fade-in zoom-in duration-700">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-success text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            Account Security
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-black">
            Reset <span className="text-black/20">Password</span>
          </h1>
          <p className="text-black/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Enter a strong new password for your account
          </p>
        </div>

        {/* Status Messages */}
        {status && (
          <div
            className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2 ${
              status.type === "error"
                ? "bg-red-50 text-red-500 border border-red-100"
                : "bg-green-50 text-brand-success border border-green-100"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-10">
          <div className="space-y-3 group relative">
            <label className="text-[10px] uppercase font-black text-black/30 ml-2 tracking-widest group-focus-within:text-black transition-colors">
              New Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border-2 border-black/[0.05] p-5 rounded-2xl bg-[#fcfcfc] text-black focus:bg-white focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all font-black placeholder:text-black/20 text-sm shadow-sm"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="group relative w-full bg-black text-white p-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-success hover:text-black transition-all active:scale-[0.97] shadow-2xl overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 italic">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Confirm New Password
                  <svg
                    className="group-hover:translate-x-2 transition-transform duration-300"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-[10px] text-black/20 font-black uppercase tracking-[0.5em] italic">
            Secure Encrypted Session
          </p>
        </div>
      </div>
    </div>
  );
}