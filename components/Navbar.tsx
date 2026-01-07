"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ initialUser }: { initialUser: any }) {
  const [user, setUser] = useState<any>(initialUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    if (!isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  };

 return (
   <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
     <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6">
       {/* 🏎️ Brand Logo */}
       <Link
         href="/"
         className="group flex items-center gap-2 relative z-[1100]"
       >
         <span className="font-black text-2xl italic tracking-tighter uppercase text-white">
           FYTRR <span className="text-brand-success">RUN</span>
         </span>
       </Link>

       {/* 💻 Desktop Navigation */}
       <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.4em]">
         <Link
           href="/gallery"
           className="text-white/40 hover:text-brand-success"
         >
           Gallery
         </Link>

         {!user ? (
           <>
             <Link
               href="/login"
               className="text-white/40 hover:text-brand-success"
             >
               Login
             </Link>
             <Link
               href="/signup"
               className="bg-white text-black px-8 py-3.5 rounded-2xl hover:bg-brand-success transition-all shadow-lg italic"
             >
               Join Race
             </Link>
           </>
         ) : (
           <>
             <Link
               href="/dashboard"
               className="text-white flex items-center gap-2"
             >
               <span className="h-1.5 w-1.5 bg-brand-success rounded-full animate-pulse" />
               Dashboard
             </Link>
             <button
               className="text-brand-danger/60 hover:text-brand-danger italic"
               onClick={async () => {
                 await supabase.auth.signOut();
                 setUser(null);
                 router.push("/");
                 router.refresh();
               }}
             >
               Logout
             </button>
           </>
         )}
       </div>

       {/* 📱 Hamburger Button (HIDES when menu open) */}
       <button
         onClick={toggleMenu}
         className={`md:hidden p-2 text-white transition-opacity ${
           isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
         }`}
       >
         <div className="space-y-1.5">
           <span className="block h-0.5 w-6 bg-current" />
           <span className="block h-0.5 w-6 bg-current" />
           <span className="block h-0.5 w-6 bg-current" />
         </div>
       </button>

       {/* 🏁 Mobile Navigation Overlay */}
       <div
         className={`fixed inset-0 bg-black z-[1000] flex flex-col md:hidden
        transition-all duration-300 ease-out
        ${
          isMenuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
       >
         {/* ❌ Close Button */}
         <button
           onClick={toggleMenu}
           className="absolute top-6 right-6 text-white text-3xl z-[1200]"
         >
           ✕
         </button>

         {/* Giant Background Text */}
         <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
           <div className="text-[15rem] font-black italic uppercase text-white -rotate-90">
             FYTRR
           </div>
         </div>

         {/* Menu Links */}
         <div className="flex flex-col items-center justify-center h-full gap-6 text-3xl font-black italic uppercase relative z-10">
           <Link
             href="/"
             onClick={toggleMenu}
             className="text-white hover:text-brand-success"
           >
             Home
           </Link>
           <Link
             href="/gallery"
             onClick={toggleMenu}
             className="text-white hover:text-brand-success"
           >
             Gallery
           </Link>

           <div className="w-12 h-0.5 bg-white/10 my-4" />

           {!user ? (
             <>
               <Link
                 href="/login"
                 onClick={toggleMenu}
                 className="text-white/40"
               >
                 Login
               </Link>
               <Link
                 href="/signup"
                 onClick={toggleMenu}
                 className="bg-white text-black px-10 py-5 rounded-2xl shadow-xl text-xl italic"
               >
                 Join Race
               </Link>
             </>
           ) : (
             <>
               <Link
                 href="/dashboard"
                 onClick={toggleMenu}
                 className="text-brand-success text-4xl"
               >
                 Dashboard
               </Link>
               <button
                 className="text-red-500/60 text-xl mt-6"
                 onClick={async () => {
                   toggleMenu();
                   await supabase.auth.signOut();
                   setUser(null);
                   router.push("/");
                   router.refresh();
                 }}
               >
                 Logout
               </button>
             </>
           )}

           <div className="absolute bottom-10 text-[10px] tracking-[0.5em] text-white/10 italic">
             Beyond Limits • 2026
           </div>
         </div>
       </div>
     </div>
   </nav>
 );

}