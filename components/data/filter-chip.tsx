import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface FilterChipProps {
  label: string;
  value: string;
  onDismiss: () => void;
  color?: "blue" | "green" | "amber" | "red" | "zinc";
  className?: string;
}

const colorMap = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  green:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  amber:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export function FilterChip({
  label,
  value,
  onDismiss,
  color = "blue",
  className,
}: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorMap[color],
        className
      )}
    >
      <span className="text-current/60">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onDismiss}
        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
