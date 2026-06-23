import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Flame, Gift, Lock, Share2, Trophy, Users } from 'lucide-react';
import { ACHIEVEMENTS, DAILY_ACTIONS, useGame } from '@/lib/gamification';
import { cn } from '@/lib/utils';

const leaderboard = [
  { name: 'Maya', title: 'Host Captain', xp: 1850, avatar: '🌺' },
  { name: 'Leo', title: 'Nightlife Scout', xp: 1420, avatar: '🌙' },
  { name: 'Nina', title: 'Nomad Connector', xp: 980, avatar: '💻' },
];

export default function GameHub({ className = '' }) {
  const game = useGame();
  const remaining = Math.max(0, game.level.nextXp - game.xp);

  const shareInvite = async () => {
    const text = 'Join me on Samui Connect — find people, rooms and events on Koh Samui today 🌴';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Samui Connect', text, url: window.location.origin });
      } else {
        await navigator.clipboard?.writeText(window.location.origin);
      }
      game.award('share-invite', 35);
    } catch {
      // Sharing can be cancelled by the user; do not show an error.
    }
  };

  return (
    <section className={cn('space-y-4', className)}>
      <div className="relative overflow-hidden rounded-[1.8rem] border border-primary/20 bg-card p-4 shadow-[0_22px_80px_rgba(0,0,0,.28)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,hsl(var(--primary)/.25),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(236,72,153,.22),transparent_30%)]" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              <Crown className="h-3.5 w-3.5" />
              Island status
            </div>
            <h2 className="font-heading text-2xl font-black leading-none">
              {game.level.badge} Lv. {game.level.level} · {game.level.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{remaining} XP to next unlock · {game.level.perk}</p>
          </div>
          <button
            onClick={shareInvite}
            className="rounded-2xl border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-black text-primary transition hover:bg-primary/20"
          >
            <Share2 className="mr-1 inline h-3.5 w-3.5" />
            +35 XP
          </button>
        </div>

        <div className="relative mt-4">
          <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-bold">{game.xp} XP</span>
            <span className="flex items-center gap-1 font-bold text-orange-300"><Flame className="h-3 w-3" /> {game.streak} streak</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-secondary ring-1 ring-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${game.level.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-300 to-fuchsia-400 shadow-[0_0_18px_hsl(var(--primary)/.55)]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DAILY_ACTIONS.slice(0, 4).map((action) => {
          const done = game.completedToday[action.id];
          return (
            <button
              key={action.id}
              onClick={() => game.award(action.id, action.xp)}
              disabled={done}
              className={cn(
                'rounded-[1.25rem] border p-3 text-left transition-all',
                done
                  ? 'border-primary/15 bg-primary/10'
                  : 'border-border/70 bg-card hover:border-primary/35 hover:bg-primary/5'
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-lg">{action.emoji}</span>
                <span className={cn('text-[10px] font-black uppercase tracking-[0.15em]', done ? 'text-primary' : 'text-muted-foreground')}>
                  {done ? 'Done' : `+${action.xp} XP`}
                </span>
              </div>
              <p className="text-sm font-black leading-tight">{action.label}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-[1.6rem] border border-border/70 bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-black">
            <Trophy className="h-4 w-4 text-primary" />
            Island leaderboard
          </h3>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black text-primary">Weekly</span>
        </div>
        <div className="space-y-2">
          {[{ name: 'You', title: game.level.title, xp: game.xp, avatar: game.level.badge, you: true }, ...leaderboard].map((item, index) => (
            <div key={`${item.name}-${index}`} className={cn('flex items-center gap-3 rounded-2xl px-3 py-2', item.you ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-background/35')}>
              <span className="w-5 text-xs font-black text-muted-foreground">#{index + 1}</span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-lg">{item.avatar}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black">{item.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{item.title}</p>
              </div>
              <span className="text-xs font-black text-primary">{item.xp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-border/70 bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-black">
            <Gift className="h-4 w-4 text-primary" />
            Badges
          </h3>
          <span className="text-[11px] text-muted-foreground">{game.badges.filter((b) => b.unlocked).length}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {game.badges.map((badge) => (
            <div
              key={badge.id}
              title={badge.title}
              className={cn(
                'grid aspect-square place-items-center rounded-2xl border text-xl',
                badge.unlocked
                  ? 'border-primary/25 bg-primary/10 shadow-[0_0_18px_hsl(var(--primary)/.08)]'
                  : 'border-border/60 bg-background/35 opacity-55'
              )}
            >
              {badge.unlocked ? badge.emoji : <Lock className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-primary/20 bg-primary/10 p-4 text-sm">
        <p className="flex items-center gap-2 font-black text-primary"><Users className="h-4 w-4" /> Viral mechanic ready</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Every invite, room join, event post and message now feeds the XP loop. Next step: store XP in Base44 profiles for public rankings.
        </p>
      </div>
    </section>
  );
}
