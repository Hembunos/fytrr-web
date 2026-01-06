"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const isSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    if (isSuccess) {
      setShow(true);

      // 1. Wait 5 seconds for the user to read the message
      const timer = setTimeout(() => {
        setShow(false);

        // 2. Remove "?success=true" from the URL without refreshing the page
        const params = new URLSearchParams(searchParams.toString());
        params.delete("success");
        router.replace(
          `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
          {
            scroll: false,
          }
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, router, pathname, searchParams]);

  if (!show) return null;

  return (
    <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-2xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-green-500 text-white rounded-full p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div>
        <p className="font-black text-sm uppercase italic tracking-tight">
          Payment Successful!
        </p>
        <p className="text-xs opacity-80">
          Your athletes are registered. BIB numbers are shown below.
        </p>
      </div>
    </div>
  );
}
