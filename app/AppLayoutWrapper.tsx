"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/lib/store";
import SplashScreen from "@/components/ui/SplashScreen";

export default function AppLayoutWrapper({ children }: { children: ReactNode }) {
  const { colorTheme } = useStore();
  const pathname = usePathname();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Handle global color theme changes
  useEffect(() => {
    if (colorTheme && colorTheme !== 'green') {
      document.documentElement.setAttribute('data-theme', colorTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [colorTheme]);

  // Handle Splash Screen timing
  useEffect(() => {
    // Only show splash screen on the initial load, not subsequent navigations
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <>
      <SplashScreen isVisible={isSplashVisible} />
      
      {/* We only mount the main app layout when the splash screen starts fading out, 
          so the framer-motion dashboard stagger animations play at the perfect time. */}
      {!isSplashVisible && (
        <AppLayout>
          {children}
        </AppLayout>
      )}
    </>
  );
}
