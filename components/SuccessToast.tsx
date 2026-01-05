"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
      <div className="bg-green-500 text-white rounded-full p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <p className="font-bold text-sm">Payment Successful!</p>
        <p className="text-xs">
          Your athletes are registered. BIB numbers are shown below.
        </p>
      </div>
    </div>
  );
}
