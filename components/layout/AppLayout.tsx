"use client";

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  SFSquareGrid2x2 as Grid, 
  SFShield as Shield, 
  SFEye as Eye, 
  SFDesktopcomputer as Bot, 
  SFPencil as PenTool, 
  SFCylinderSplit1x2 as Database, 
  SFMagnifyingglass as Search, 
  SFBell as Bell, 
  SFArrowClockwise as RefreshCw, 
  SFSunMax as Sun, 
  SFMoon as Moon,
  SFChartBar as ChartBar,
  SFFolder as FolderBadge,
  SFPencil as DocText,
  SFCreditcard as CreditCard,
  SFBriefcase as Briefcase,
  SFExclamationmarkTriangle as ExclamationTriangle,
  SFRadio as Radio
} from 'sf-symbols-lib/monochrome';
import { useTheme } from 'next-themes';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { IconLogo } from '@/components/ui/IconLogo';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, searchQuery, setSearchQuery } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchVal, setSearchVal] = useState(searchQuery);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowNotifications(true);
    }, 1000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setSearchQuery(searchVal);
    const query = searchVal.toLowerCase();
    if (query.includes('competitor') || query.includes('dnv') || query.includes('sphera') || query.includes('intelex') || query.includes('vs')) {
      router.push('/competitors');
    } else if (query.includes('train') || query.includes('upload') || query.includes('data') || query.includes('document')) {
      router.push('/training-data');
    } else if (query.includes('ask') || query.includes('what is') || query.includes('how does') || query.includes('assistant')) {
      router.push('/assistant');
    } else if (query.includes('setting') || query.includes('config') || query.includes('api')) {
      router.push('/settings');
    } else {
      router.push('/');
    }
  };

  const navItems = [
    {
      group: 'COMMAND CENTER',
      items: [
        { label: 'Executive Dashboard', href: '/', icon: Grid },
        { label: 'Strategic Frameworks', href: '/frameworks', icon: ChartBar },
      ]
    },
    {
      group: 'COMPETITOR INTEL',
      items: [
        { label: 'Competitor Directory', href: '/competitors', icon: FolderBadge },
        { label: 'Sales Battlecards', href: '/competitors/battlecards', icon: DocText },
        { label: 'Pricing & Packaging', href: '/competitors/pricing', icon: CreditCard },
        { label: 'Tech Stack Vulnerabilities', href: '/product/tech-stack', icon: Database },
      ]
    },
    {
      group: 'AI & KNOWLEDGE',
      items: [
        { label: 'Knowledge Assistant', href: '/assistant', icon: Bot },
        { label: 'AI Training Data', href: '/training-data', icon: Database }
      ]
    },
    {
      group: 'REPORTING & EXPORTS',
      items: [
        { label: 'Board-Level Export', href: '/reporting/export', icon: DocText }
      ]
    }
  ];

  const getHeaderInfo = () => {
    for (const group of navItems) {
      for (const item of group.items) {
        if (pathname === item.href) {
          return { title: item.label, label: group.group };
        }
      }
    }
    return { title: 'Dashboard', label: 'OVERVIEW' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen flex bg-transparent text-foreground font-sans z-0 relative">
      
      {/* Floating Expandable Sidebar */}
      <aside className="peer fixed left-4 top-4 bottom-4 w-[72px] hover:w-[275px] bg-card/95 backdrop-blur-2xl border border-card-border rounded-[32px] z-50 hidden md:flex flex-col justify-between group overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-xl shadow-black/5 dark:shadow-none">
        
        <div className="flex flex-col flex-1 overflow-y-auto hide-scrollbar pb-2">
          {/* Logo Section */}
          <div className="h-[88px] flex items-center px-[22px] shrink-0">
            <Link href="/" className="flex items-center">
              {/* Icon / Collapsed state */}
              <div className="w-8 h-8 flex items-center justify-center shrink-0 group-hover:opacity-0 group-hover:scale-50 absolute transition-all duration-300">
                <IconLogo className="w-8 h-auto text-text-primary" />
              </div>
              {/* Full Logo / Expanded state */}
              <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-text-primary">
                <Logo className="h-8 w-auto" />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="px-[11px] space-y-4 flex-1 py-2">
            {navItems.map((group) => (
              <div key={group.group} className="space-y-0.5 relative">
                {/* Group Label */}
                <span className="px-4 text-[10px] font-bold text-text-secondary/40 tracking-[0.1em] uppercase block mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {group.group}
                </span>
                
                {/* Items */}
                <div className="space-y-1 relative z-10">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                          "block h-10 rounded-xl transition-all duration-200 relative overflow-hidden",
                          isActive
                            ? "text-accent"
                            : "text-text-secondary hover:text-text-primary hover:bg-panel"
                        )}
                        title={item.label}
                      >
                        {/* Active Background Indicator */}
                        {isActive && (
                          <div className="absolute inset-0 bg-accent/8 rounded-xl" />
                        )}

                        <div className="absolute left-[1px] top-0 w-12 h-10 flex items-center justify-center z-10">
                          <Icon className={cn("h-[16px] w-[16px] transition-colors", isActive ? "text-accent" : "text-text-secondary/60")} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        
                        <div className="h-full pl-12 pr-4 flex items-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                          <span className="text-xs font-semibold">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="px-[11px] pb-4 shrink-0 relative bg-card/95 pt-2 border-t border-card-border mt-2">
          <Link href="/settings" className={cn(
            "block h-10 rounded-xl transition-colors cursor-pointer overflow-hidden relative",
            pathname === '/settings' ? "bg-accent/10 border border-accent/20" : "bg-panel/50 hover:bg-panel"
          )}>
            <div className="absolute left-[1px] top-0 w-12 h-10 flex items-center justify-center z-10">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="h-full pl-12 pr-4 flex flex-col justify-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
              <p className="text-[10px] font-medium text-text-secondary truncate">{user.role}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:pl-[104px] peer-hover:md:pl-[292px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Floating Top Bar */}
        <header className="sticky top-4 mx-4 h-[68px] bg-card/80 backdrop-blur-2xl border border-card-border rounded-3xl z-40 flex items-center justify-between px-6 shadow-sm mb-4">
          {/* Left: Title */}
          <div className="flex flex-col gap-0.5">
            <span className="text-micro font-bold text-accent tracking-[0.1em] uppercase leading-none">
              {headerInfo.label}
            </span>
            <h2 className="text-headline font-bold text-text-primary leading-none">
              {headerInfo.title}
            </h2>
          </div>

          {/* Centre: Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-[360px] max-w-full mx-4">
            <Search className="absolute left-4 h-4 w-4 text-text-secondary/40 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search..."
              className="w-full bg-panel border border-card-border rounded-full pl-11 pr-14 py-2 text-footnote text-text-primary focus:outline-none focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all font-sans placeholder:text-text-secondary/40"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-accent text-white rounded-full text-micro font-bold hover:bg-accent-hover transition-colors shadow-sm"
            >
              Ask
            </button>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className={cn(
                "w-10 h-10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/5 rounded-full transition-all shrink-0",
                isRefreshing && "animate-spin text-accent"
              )}
              title="Refresh cache"
            >
              <RefreshCw className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/5 rounded-full transition-all shrink-0 relative"
              >
                <Bell className="h-[18px] w-[18px]" strokeWidth={2.5} />
                {hasUnread && (
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[#EF4444] rounded-full border-2 border-card" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card/95 backdrop-blur-xl border border-card-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-card-border flex justify-between items-center bg-background/50">
                    <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
                    {hasUnread && (
                      <span className="text-micro font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        2 New
                      </span>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    <div className="p-4 border-b border-card-border hover:bg-card-border/30 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                          <Eye className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-bold text-text-primary leading-tight">
                            Competitor Content Detected
                          </p>
                          <p className="text-caption text-text-secondary leading-snug">
                            New strategic positioning from HSE Software Ltd detected in press release.
                          </p>
                          <span className="text-micro text-text-secondary/60 uppercase font-bold mt-1">10 mins ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-card-border hover:bg-card-border/30 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                          <RefreshCw className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-bold text-text-primary leading-tight">
                            Platform Status Synced
                          </p>
                          <p className="text-caption text-text-secondary leading-snug">
                            All competitor background trackers are active.
                          </p>
                          <span className="text-micro text-text-secondary/60 uppercase font-bold mt-1">1 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setHasUnread(false);
                      setShowNotifications(false);
                    }}
                    className="p-3 bg-background/50 text-center border-t border-card-border cursor-pointer hover:text-accent transition-colors"
                  >
                    <span className="text-micro font-bold text-text-secondary uppercase tracking-wider">
                      Mark all as read
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/5 rounded-full transition-all shrink-0 cursor-pointer"
              title="Toggle theme"
            >
              {mounted && resolvedTheme === 'dark' ? <Sun className="h-[18px] w-[18px]" strokeWidth={2.5} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={2.5} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full min-h-0 px-4 md:px-0">
          {children}
        </main>
      </div>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-4 left-4 right-4 h-16 bg-card/95 backdrop-blur-xl border border-card-border rounded-2xl z-50 md:hidden flex items-center justify-around px-2 shadow-lg">
        {navItems.map((group) => {
          const item = group.items[0];
          const isActive = pathname === item.href || (group.group === 'INTELLIGENCE' && pathname === '/competitors');
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-xl transition-all w-12",
                isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-micro font-bold mt-1 max-w-[50px] truncate leading-none">
                {group.group === 'INTELLIGENCE' ? 'Intel' : item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
