import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { visualByCategory } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';

const categoryIcons = {
  activities: '🤿',
  nightlife: '🎉',
  coworking: '💻',
  b2b: '💼',
};

const subcategoryAccent = {
  activities: 'from-cyan-400/80 via-teal-400/50 to-transparent',
  nightlife: 'from-fuchsia-400/85 via-pink-500/55 to-transparent',
  coworking: 'from-blue-400/80 via-indigo-400/50 to-transparent',
  b2b: 'from-amber-300/80 via-orange-400/50 to-transparent',
};

export default function RoomCard({ room }) {
  const game = useGame();
  const visual = visualByCategory(room.subcategory);

  return (
    <Link
      to={`/room/${room.id}`}
      onClick={() => game.award('join-room', 15)}
      className="block group"
    >
      <div className="relative min-h-[168px] overflow-hidden rounded-[1.45rem] border border-white/10 bg-card shadow-[0_18px_52px_rgba(0,0,0,.25)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_0_32px_hsl(var(--primary)/0.13)]">
        <img
          src={visual}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-background/25 to-background/95" />
        <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-br opacity-80', subcategoryAccent[room.subcategory] || 'from-primary/50 to-transparent')} />

        <div className="relative flex h-full min-h-[168px] flex-col justify-between p-3.5">
          <div className="flex items-start justify-between gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-black/25 text-2xl shadow-lg backdrop-blur-xl">
              {categoryIcons[room.subcategory] || room.icon || '💬'}
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-black/35 px-2.5 py-1.5 text-xs font-black text-primary backdrop-blur-xl">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
              {room.online_count || Math.floor(Math.random() * 20 + 3)}
            </div>
          </div>

          <div>
            <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75 backdrop-blur-xl">
              <Users className="h-3 w-3" /> Live Room
            </div>
            <h3 className="font-heading text-base font-black leading-tight text-white transition-colors group-hover:text-primary">
              {room.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/65">
              {room.description || `Join the ${room.name} chat`}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary">Join +15 XP</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary transition-transform group-hover:translate-x-0.5">
                <Zap className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
