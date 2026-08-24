"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FilterChip } from "./filter-chip";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

export type FilterType = "text" | "select" | "multiselect" | "date" | "daterange";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
  displayValue: string;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters?: ActiveFilter[];
  onFilterChange?: (filterId: string, value: string) => void;
  onFilterRemove?: (filterId: string) => void;
  onClearAll?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export function FilterBar({
  filters,
  activeFilters = [],
  onFilterChange = () => {},
  onFilterRemove = () => {},
  onClearAll = () => {},
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  className,
}: FilterBarProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Search input */}
        {onSearchChange && (
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Filter dropdowns */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          {filters.map((filter) => (
            <div key={filter.id} className="relative">
              <button
                onClick={() =>
                  setOpenFilter(openFilter === filter.id ? null : filter.id)
                }
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
                  openFilter === filter.id
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                )}
              >
                {filter.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {openFilter === filter.id && (
                <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                  {filter.type === "text" && (
                    <div className="px-3 py-2">
                      <input
                        type="text"
                        placeholder={filter.placeholder || `Filter by ${filter.label}...`}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value;
                            if (val) {
                              onFilterChange(filter.id, val);
                              setOpenFilter(null);
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                  {(filter.type === "select" ||
                    filter.type === "multiselect") &&
                    filter.options?.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onFilterChange(filter.id, opt.value);
                          if (filter.type === "select") setOpenFilter(null);
                        }}
                        className={cn(
                          "flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                          activeFilters.some(
                            (af) =>
                              af.id === filter.id && af.value === opt.value
                          )
                            ? "text-blue-700 font-medium dark:text-blue-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  {filter.type === "date" && (
                    <div className="px-3 py-2">
                      <input
                        type="date"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        onChange={(e) => {
                          if (e.target.value) {
                            onFilterChange(filter.id, e.target.value);
                            setOpenFilter(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {filter.type === "daterange" && (
                    <div className="space-y-2 px-3 py-2">
                      <input
                        type="date"
                        placeholder="Start date"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        id={`${filter.id}-start`}
                      />
                      <input
                        type="date"
                        placeholder="End date"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        id={`${filter.id}-end`}
                      />
                      <button
                        onClick={() => {
                          const startEl = document.getElementById(
                            `${filter.id}-start`
                          ) as HTMLInputElement;
                          const endEl = document.getElementById(
                            `${filter.id}-end`
                          ) as HTMLInputElement;
                          if (startEl?.value && endEl?.value) {
                            onFilterChange(
                              filter.id,
                              `${startEl.value}~${endEl.value}`
                            );
                            setOpenFilter(null);
                          }
                        }}
                        className="w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeFilters.map((filter) => (
            <FilterChip
              key={`${filter.id}-${filter.value}`}
              label={filter.label}
              value={filter.displayValue}
              onDismiss={() => onFilterRemove(filter.id)}
            />
          ))}
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
