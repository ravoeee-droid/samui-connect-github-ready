import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Compass, Home, Store, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/lib/gamification';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Connect' },
  { path: '/rentals', icon: Store, label: 'Rentals' },
  { path: '/events', icon: CalendarDays, label: 'Events' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const game = useGame();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-card/90 backdrop-blur-2xl safe-area-bottom shadow-[0_-24px_80px_rgba(0,0,0,.36)]">
      <div className="mx-auto flex h-[72px] max-w-lg items-center justify-around px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);
          const isProfile = path === '/profile';

          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'relative flex h-full w-16 flex-col items-center justify-center gap-0.5 transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isProfile && (
                <span className="absolute -top-2 flex items-center gap-1 rounded-full border border-primary/30 bg-background px-2 py-0.5 text-[9px] font-black text-primary shadow-lg">
                  <Trophy className="h-2.5 w-2.5" /> {game.level.level}
                </span>
              )}
              <Icon className={cn('h-5 w-5', isActive && 'drop-shadow-[0_0_6px_hsl(var(--primary))]')} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
