'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  SFMagnifyingglass as Search,
  SFBell as Bell,
  SFMoon as Moon,
  SFSunMax as Sun,
  SFLine3Horizontal as Menu,
} from 'sf-symbols-lib/monochrome';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface UserInfo {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface HeaderProps {
  user: UserInfo;
  notifications?: Notification[];
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  className?: string;
}

export function Header({
  user,
  notifications = [],
  onMenuClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
  onThemeToggle,
  isDarkMode = true,
  className,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifTypeColors: Record<string, string> = {
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    success: 'bg-emerald-500',
  };

  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-4',
        className,
      )}
    >
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Image
          src="/logo.svg"
          alt="Empirisys"
          width={120}
          height={42}
          className="shrink-0 logo-themed"
        />
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <button
          onClick={onSearchClick}
          className="flex w-full items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3.5 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)]/50 cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span>Search reports, metrics, datasets...</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Mobile search */}
        <button
          onClick={onSearchClick}
          className="md:hidden rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-micro font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-popover)] shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => {
                        onNotificationClick?.(notif);
                        setNotifOpen(false);
                      }}
                      className={cn(
                        'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-accent)] cursor-pointer',
                        !notif.read && 'bg-[var(--color-primary)]/5',
                      )}
                    >
                      <div
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          notifTypeColors[notif.type],
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {notif.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-0.5">
                          {notif.description}
                        </p>
                        <p className="text-caption text-[var(--color-text-faint)] mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu removed for now */}
      </div>
    </header>
  );
}
