"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { ElementType as LucideIcon } from 'react';
import { SFChevronDown as ChevronDown } from 'sf-symbols-lib/monochrome';

export interface NavSubItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  subItems?: NavSubItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface SidebarNavProps {
  sections: NavSection[];
  activePath: string;
  collapsed: boolean;
  onNavigate?: (href: string) => void;
}

export function SidebarNav({
  sections,
  activePath,
  collapsed,
  onNavigate,
}: SidebarNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set<string>());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleItemClick = (item: NavItem) => {
    if (item.subItems && item.subItems.length > 0 && !collapsed) {
      toggleExpand(item.id);
    } else {
      onNavigate?.(item.href);
    }
  };

  const isActive = (href: string) => activePath === href;
  const isSectionActive = (item: NavItem) =>
    isActive(item.href) || (item.subItems?.some((sub) => isActive(sub.href)) ?? false);

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="mb-1.5 px-3 text-micro font-bold uppercase tracking-[0.12em] text-[var(--color-text-faint)]">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const expanded = expandedItems.has(item.id);
              const active = isSectionActive(item);

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-footnote font-medium transition-all cursor-pointer",
                      active
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm shadow-[var(--color-primary)]/20"
                        : "text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-text-primary)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active
                          ? "text-[var(--color-primary-foreground)]"
                          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]"
                      )}
                    />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-micro font-bold text-[var(--color-primary)]">
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && item.subItems.length > 0 && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform",
                          expanded && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {/* Sub-items */}
                  {expanded && item.subItems && item.subItems.length > 0 && (
                    <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-[var(--color-border)] pl-3">
                      {item.subItems.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => onNavigate?.(sub.href)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-footnote transition-colors cursor-pointer",
                              isActive(sub.href)
                                ? "font-medium text-[var(--color-text-primary)] bg-[var(--color-sidebar-accent)]"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-sidebar-accent)]"
                            )}
                          >
                            <span className="flex-1 text-left truncate">{sub.label}</span>
                            {sub.badge && (
                              <span className="rounded-full bg-[var(--color-sidebar-accent)] px-1.5 py-0.5 text-micro font-medium text-[var(--color-text-secondary)]">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
