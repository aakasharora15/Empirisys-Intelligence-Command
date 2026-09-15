"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary px-4 text-center">
      <div className="max-w-md p-8 bg-card border border-card-border rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#EF4444]">System Error</h2>
        <p className="text-text-secondary mb-8">
          A critical failure occurred while loading the intelligence engine.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-accent text-background font-bold rounded-lg hover:bg-accent/90 transition-colors"
        >
          Reboot System
        </button>
      </div>
    </div>
  );
}
