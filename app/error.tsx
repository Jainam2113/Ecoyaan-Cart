"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-6">We&apos;re sorry for the inconvenience. Please try again.</p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-red-500 mb-4 font-mono bg-red-50 p-3 rounded-xl text-left break-all">{error.message}</p>
        )}
        <button
          onClick={reset}
          className="bg-[#1a472a] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-[#145222] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
