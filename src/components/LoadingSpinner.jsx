"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  size = 40,
  fullPage = false,
  text = "",
  className = "",
}) {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2
          className={`animate-spin text-[#1C8BCA] ${className}`}
          size={size}
        />
        {text && <p className="mt-3 text-gray-500 font-medium">{text}</p>}
      </div>
    );
  }

  return (
    <Loader2
      className={`animate-spin text-[#1C8BCA] ${className}`}
      size={size}
    />
  );
}
