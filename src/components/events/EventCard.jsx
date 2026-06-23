import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Ticket, Sparkles } from 'lucide-react';
import { visualByCategory } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';

const timeLabelColors = {
  now: 'bg-primary/20 text-primary border-primary/30',
  today: 'bg-accent/20 text-accent border-accent/30',
  tonight: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  tomorrow: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export default function EventCard({ event, onJoin }) {
  const game = useGame();
  const visual = visualByCategory(event.category || 'social');

  const handleJoin = () => {
    game.award('post-event', 40);
    onJoin?.(event);
  };

  return (
    <div className="group overflow-hidden rounded-[1.55rem] border border-border/60 bg-card shadow-[0_18px_55px_rgba(0,0,0,.24)] transition-all duration-300 hover:border-primary/25">
      <div className="relative h-36 overflow-hidden">
        <img src={visual} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-card" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge className={`text-[10px] font-black uppercase ${timeLabelColors[event.time_label] || 'bg-secondary text-secondary-foreground'} border backdrop-blur-xl`}>
            {event.time_label || 'soon'}
          </Badge>
          <span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/80 backdrop-blur-xl">
            +40 XP
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="flex-1 pr-2 font-heading text-base font-black leading-tight text-foreground">{event.title}</h3>
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        </div>

        <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {event.samui_area && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {event.samui_area}
            </span>
          )}
          {event.starts_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {event.starts_at}
            </span>
          )}
          {event.max_people && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> max {event.max_people}
            </span>
          )}
          {event.is_paid && (
            <span className="flex items-center gap-1 text-amber-300">
              <Ticket className="h-3 w-3" /> Paid
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {event.creator_avatar ? (
              <img src={event.creator_avatar} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-primary/30" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-secondary" />
            )}
            <span className="text-xs text-muted-foreground">{event.creator_name || 'Anonymous'}</span>
          </div>
          <button
            onClick={handleJoin}
            className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black text-primary transition-colors hover:bg-primary/20"
          >
            Join →
          </button>
        </div>
      </div>
    </div>
  );
}
