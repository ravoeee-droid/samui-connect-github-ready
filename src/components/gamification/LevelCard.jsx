import React from 'react';
import { CheckCircle2, ChevronRight, Flame, Gift, Trophy, Zap } from 'lucide-react';
import { DAILY_ACTIONS, useGame } from '@/lib/gamification';
import { cn } from '@/lib/utils';

export default function LevelCard({ compact = false, className = '' }) {
  const game = useGame();
  const nextRemaining = Math.max(0, game.level.nextXp - game.xp);

  return (
    <section className={cn(
      'relative overflow-hidden rounded-[1.7rem] border border-primary/20 bg-card p-4 shadow-[0_24px_90px_rgba(0,0,0,.28)]',
      compact ? 'space-y-3' : 'space-y-4',
      className
    )}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,hsl(var(--primary)/.28),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,.20),transparent_30%),linear-gradient(135deg,rgba(255,255,255,.08),transparent_45%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
            <Trophy className="h-3.5 w-3.5" />
            Connect Level
          </div>
          <h2 className={cn('font-heading font-black leading-none text-foreground', compact ? 'text-xl' : 'text-2xl')}>
            Lv. {game.level.level} · {game.level.title}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {nextRemaining} XP bis zum nächsten Status · {game.level.perk}
          </p>
        </div>

        <button
          onClick={game.checkIn}
          disabled={game.completedToday['daily-checkin']}
          className={cn(
            'shrink-0 rounded-2xl px-3 py-2 text-xs font-black transition-all',
            game.completedToday['daily-checkin']
              ? 'bg-primary/10 text-primary'
              : 'bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/.35)] hover:scale-[1.03]'
          )}
        >
          {game.completedToday['daily-checkin'] ? 'Checked ✓' : '+25 XP'}
        </button>
      </div>

      <div className="relative">
        <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-semibold">{game.xp} XP total</span>
          <span className="flex items-center gap-1 font-semibold text-orange-300"><Flame className="h-3 w-3" /> {game.streak} day streak</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary ring-1 ring-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-300 to-fuchsia-400 shadow-[0_0_18px_hsl(var(--primary)/.55)] transition-all duration-700"
            style={{ width: `${game.level.progress}%` }}
          />
        </div>
      </div>

      {!compact && (
        <div className="relative grid gap-2">
          {DAILY_ACTIONS.map((action) => {
            const done = game.completedToday[action.id];
            return (
              <button
                key={action.id}
                onClick={() => game.award(action.id, action.xp)}
                disabled={done}
                className={cn(
                  'group flex items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition-all',
                  done
                    ? 'border-primary/15 bg-primary/10 text-muted-foreground'
                    : 'border-border/70 bg-background/35 hover:border-primary/35 hover:bg-primary/5'
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-base">{action.emoji}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">{action.label}</span>
                    <span className="block text-[11px] text-muted-foreground">+{action.xp} XP</span>
                  </span>
                </span>
                {done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="relative flex items-center justify-between rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
        <span className="flex items-center gap-2 font-bold"><Gift className="h-4 w-4" /> Next unlock</span>
        <span className="flex items-center gap-1 text-amber-200"><Zap className="h-3 w-3" /> Boosted visibility</span>
      </div>
    </section>
  );
}
