import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Zap } from 'lucide-react';

export default function GameOverlay() {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setEvent({ ...e.detail, id: `${Date.now()}-${Math.random()}` });
      window.setTimeout(() => setEvent((current) => (current?.id === e.detail?.id ? null : current)), 2400);
    };

    const wrapped = (e) => {
      const id = `${Date.now()}-${Math.random()}`;
      setEvent({ ...e.detail, id });
      window.setTimeout(() => setEvent((current) => (current?.id === id ? null : current)), 2600);
    };

    window.addEventListener('samui-xp-earned', wrapped);
    return () => window.removeEventListener('samui-xp-earned', wrapped);
  }, []);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, y: -28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 520, damping: 32 }}
          className="pointer-events-none fixed left-1/2 top-5 z-[80] w-[min(92vw,390px)] -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-[1.35rem] border border-primary/30 bg-background/88 p-3 shadow-[0_22px_80px_rgba(0,0,0,.5)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,hsl(var(--primary)/.34),transparent_32%),radial-gradient(circle_at_100%_20%,rgba(236,72,153,.25),transparent_30%)]" />
            <div className="relative flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-xl text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/.35)]">
                {event.leveledUp ? <Trophy className="h-5 w-5" /> : event.emoji || <Zap className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                  <Sparkles className="h-3 w-3" />
                  {event.leveledUp ? 'Level up' : 'XP earned'}
                </p>
                <p className="truncate text-sm font-black text-foreground">
                  {event.leveledUp ? `Lv. ${event.newLevel.level} · ${event.newLevel.title}` : event.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{event.gainedXp} XP · {event.xp} XP total
                </p>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                +{event.gainedXp}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
