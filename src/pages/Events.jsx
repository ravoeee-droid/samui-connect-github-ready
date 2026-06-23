import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import EventCard from '@/components/events/EventCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarPlus, MapPin, Sparkles, Users } from 'lucide-react';
import { samuiVisuals } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';

const demoEvents = [
  {
    id: 'demo-sunset-meetup',
    title: 'Sunset Beach Meetup',
    description: 'Casual first meetup for travelers, expats and nomads. Drinks, ocean view and easy introductions.',
    location: 'Chaweng Beach',
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    category: 'social',
    image_url: samuiVisuals.events,
    attendees_count: 18,
    max_attendees: 35,
    creator_name: 'Samui Connect Host',
  },
  {
    id: 'demo-coworking-day',
    title: 'Nomad Coffee & Work Session',
    description: 'Meet other people working remotely on Samui. Laptop-friendly, easy networking, zero awkwardness.',
    location: 'Bophut',
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    category: 'coworking',
    image_url: samuiVisuals.workCoworking,
    attendees_count: 11,
    max_attendees: 22,
    creator_name: 'Work Connect',
  },
];

export default function Events() {
  const navigate = useNavigate();
  const game = useGame();
  const { data: liveEvents = [] } = useQuery({
    queryKey: ['events-page'],
    queryFn: () => base44.entities.Event.list('-created_date', 20),
  });

  const events = liveEvents.length ? liveEvents : demoEvents;

  return (
    <div className="px-4 pt-5">
      <section className="relative mb-5 overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-[0_28px_80px_rgba(0,0,0,.34)]">
        <img src={samuiVisuals.events} alt="Samui events" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-background/20 to-background" />
        <div className="relative p-4 pb-5">
          <div className="mb-24 flex items-center justify-between">
            <Badge className="border-primary/30 bg-primary/15 text-[10px] font-black uppercase tracking-[0.16em] text-primary backdrop-blur-xl">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Live events
            </Badge>
            <Badge variant="outline" className="border-white/15 bg-black/35 text-white backdrop-blur-xl">
              +40 XP/join
            </Badge>
          </div>
          <h1 className="font-heading text-3xl font-black leading-[0.98] text-white drop-shadow-lg">Meetups that make Samui social</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">
            Beach dinners, nomad sessions, party nights and community meetups — all built around real connection.
          </p>
        </div>
      </section>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {[
          ['Tonight', '8 events'],
          ['This week', '24 plans'],
          ['Hosts', 'verified'],
        ].map(([title, meta]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-card/70 p-3 text-center">
            <p className="text-sm font-black text-foreground">{title}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{meta}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-black">Upcoming</h2>
          <p className="text-xs text-muted-foreground">Join, share and earn island status.</p>
        </div>
        <Button asChild className="rounded-full font-black" size="sm">
          <Link to="/app/events/new"><CalendarPlus className="mr-1.5 h-4 w-4" /> Host</Link>
        </Button>
      </div>

      <div className="mb-8 space-y-4">
        {events.map((event, index) => (
          <motion.div key={event.id || index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <EventCard
              event={event}
              onJoin={() => {
                game.award('post-event', 40, { once: false, label: `Joined ${event.title}`, emoji: '🎉' });
                navigate('/messages');
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mb-8 overflow-hidden rounded-[1.7rem] border border-primary/15 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <Users className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-black text-foreground">Host system ready</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Next production step: verified hosts, repeat events, paid featured placement for bars, restaurants and tour providers.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" /> Chaweng · Lamai · Bophut · Maenam
        </div>
      </div>
    </div>
  );
}
