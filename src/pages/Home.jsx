import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import RoomCard from '@/components/rooms/RoomCard';
import EventCard from '@/components/events/EventCard';
import LevelCard from '@/components/gamification/LevelCard';
import GameHub from '@/components/gamification/GameHub';
import HotspotRadar from '@/components/HotspotRadar';
import PushPrompt from '@/components/PushPrompt';
import { Badge } from '@/components/ui/badge';
import { Building2, Bike, Plus, Sparkles, Store, Waves, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { samuiVisuals } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';

const FILTERS = ['All', 'Activities', 'Nightlife', 'Coworking', 'B2B'];
const filterMap = { Activities: 'activities', Nightlife: 'nightlife', Coworking: 'coworking', B2B: 'b2b' };

const featuredHotspots = [
  { title: 'Snorkeling crew', meta: 'Crystal water · today', image: samuiVisuals.activities, filter: 'Activities' },
  { title: 'Beach bar tonight', meta: 'Neon sunset · Chaweng', image: samuiVisuals.nightlife, filter: 'Nightlife' },
  { title: 'Nomad coffee', meta: 'Work & connect', image: samuiVisuals.coworking, filter: 'Coworking' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const game = useGame();

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => base44.entities.Room.filter({ is_active: true }),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-created_date', 10),
  });

  const { data: profiles = [], isLoading: profileLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => base44.entities.Profile.filter({ created_by_id: user?.id }),
    enabled: !!user,
  });

  const myProfile = profiles[0];

  useEffect(() => {
    if (!profileLoading && user && profiles.length === 0) {
      navigate('/onboarding');
    }
  }, [profileLoading, user, profiles, navigate]);

  const filteredRooms = filter === 'All'
    ? rooms
    : rooms.filter(r => r.subcategory === filterMap[filter]);

  return (
    <div className="px-4 pt-5">
      <section className="relative mb-5 overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-[0_28px_80px_rgba(0,0,0,.34)]">
        <img src={samuiVisuals.hero} alt="Samui Connect social scene" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-background/35 to-background" />
        <div className="relative p-4 pb-5">
          <div className="mb-24 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 backdrop-blur-xl">
              <Waves className="h-4 w-4 text-primary" />
              <span className="text-xs font-black tracking-wide text-white">Samui Connect</span>
            </div>
            {myProfile?.avatar_url ? (
              <Link to="/profile">
                <img src={myProfile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/50" />
              </Link>
            ) : (
              <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-black/35 ring-1 ring-white/15 backdrop-blur-xl">
                <span className="text-sm font-black text-white">
                  {myProfile?.display_name?.[0]?.toUpperCase() || '?'}
                </span>
              </Link>
            )}
          </div>

          <Badge className="mb-3 border-primary/30 bg-primary/15 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            Live island radar
          </Badge>
          <h1 className="font-heading text-3xl font-black leading-[0.98] text-white drop-shadow-lg">
            {myProfile ? `Hey ${myProfile.display_name} 👋` : 'Find your people today'}
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/75">
            Join live rooms, meet people nearby and collect XP for every real connection on Koh Samui.
          </p>
        </div>
      </section>

      <LevelCard compact className="mb-5" />

      <HotspotRadar
        className="mb-5"
        onSelect={(spot) => {
          game.award('join-room', 15, { once: false, label: `${spot.name} radar tap`, emoji: '📍' });
          if (spot.type === 'Nightlife') setFilter('Nightlife');
          else if (spot.type === 'Coworking') setFilter('Coworking');
          else if (spot.type === 'Snorkel') setFilter('Activities');
          else setFilter('All');
        }}
      />

      <div className="mb-5">
        <PushPrompt />
      </div>


      <div className="mb-6 flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {featuredHotspots.map((spot) => (
          <button
            key={spot.title}
            onClick={() => setFilter(spot.filter)}
            className="group relative h-28 min-w-[210px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-card text-left shadow-[0_18px_55px_rgba(0,0,0,.22)]"
          >
            <img src={spot.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-3">
              <p className="text-sm font-black text-white">{spot.title}</p>
              <p className="mt-0.5 text-[11px] text-white/65">{spot.meta}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all duration-200',
              filter === f
                ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            )}
          >
            {f}
          </button>
        ))}
      </div>


      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-black flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" /> Rentals & Stays
          </h2>
          <Link to="/rentals" className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black text-primary">
            Explore
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/rentals" className="group relative h-36 overflow-hidden rounded-[1.5rem] border border-white/10 bg-card shadow-[0_18px_55px_rgba(0,0,0,.22)]">
            <img src={samuiVisuals.vehicles} alt="Vehicles" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-3">
              <Bike className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-black text-white">Scooters & Cars</p>
              <p className="mt-0.5 text-[11px] text-white/65">Verified island rentals</p>
            </div>
          </Link>
          <Link to="/rentals" className="group relative h-36 overflow-hidden rounded-[1.5rem] border border-white/10 bg-card shadow-[0_18px_55px_rgba(0,0,0,.22)]">
            <img src={samuiVisuals.stays} alt="Stays" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-3">
              <Building2 className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-black text-white">Monthly Stays</p>
              <p className="mt-0.5 text-[11px] text-white/65">Apartments & villas</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-black">Live Rooms</h2>
          <Badge variant="outline" className="border-primary/30 text-xs text-primary">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            {rooms.length} active
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        {filteredRooms.length === 0 && (
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
            No rooms in this category yet
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-black flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Happening Now
          </h2>
          <Link to="/events/new" className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black text-primary">
            <Plus className="h-3 w-3" /> Post Event
          </Link>
        </div>
        <div className="space-y-3">
          {events.map(event => (
            <EventCard key={event.id} event={event} onJoin={() => navigate('/messages')} />
          ))}
          {events.length === 0 && (
            <div className="relative overflow-hidden rounded-[1.7rem] border border-border/60 bg-card p-4">
              <img src={samuiVisuals.events} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
              <div className="relative text-center">
                <Zap className="mx-auto mb-3 h-7 w-7 text-primary" />
                <p className="text-sm font-bold text-foreground">No events yet — claim the first-mover boost.</p>
                <p className="mt-1 text-xs text-muted-foreground">Post the first meetup and earn +40 XP.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <GameHub className="mb-8" />
    </div>
  );
}
