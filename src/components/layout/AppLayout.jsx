import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/navigation/BottomNav';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_0%,hsl(var(--primary)/.18),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(236,72,153,.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.03),transparent_36%)]" />
      <div className="pointer-events-auto fixed right-3 top-3 z-50">
        <LanguageSwitcher compact />
      </div>
      <main className="relative mx-auto max-w-lg pb-24 lg:max-w-6xl lg:px-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
