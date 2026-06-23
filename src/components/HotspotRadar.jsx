import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGeolocation, useNetworkState } from 'react-use';
import { MapPin, Radio, WifiOff, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const HOTSPOTS = [
  { id: 'chaweng', name: 'Chaweng', type: 'Nightlife', people: 42, x: 68, y: 38, glow: 'bg-fuchsia-400', room: 'Beach bar tonight' },
  { id: 'lamai', name: 'Lamai', type: 'Sunset', people: 27, x: 72, y: 66, glow: 'bg-orange-300', room: 'Sunset beer crew' },
  { id: 'bophut', name: 'Bophut', type: 'Social', people: 31, x: 47, y: 26, glow: 'bg-primary', room: 'Fisherman village' },
  { id: 'maenam', name: 'Maenam', type: 'Coworking', people: 19, x: 36, y: 22, glow: 'bg-cyan-300', room: 'Nomad coffee' },
  { id: 'silver', name: 'Silver Beach', type: 'Snorkel', people: 14, x: 75, y: 54, glow: 'bg-teal-300', room: 'Snorkeling crew' },
];

export default function HotspotRadar({ className = '', onSelect }) {
  const geo = useGeolocation();
  const network = useNetworkState();
  const onlinePeople = useMemo(() => HOTSPOTS.reduce((sum, spot) => sum + spot.people, 0), []);

  return (
    <section className={cn('relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-card p-4 shadow-[0_24px_80px_rgba(0,0,0,.28)]', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/.18),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(236,72,153,.14),transparent_32%)]" />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
            <Radio className="h-3.5 w-3.5" />
            Live Hotspot Radar
          </p>
          <h2 className="font-heading text-xl font-black">Where the island is active</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {onlinePeople} people across Samui · tap a hotspot to explore
          </p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Signal</p>
          <p className="text-xs font-bold text-foreground">{network.online === false ? 'Offline' : 'Live'}</p>
        </div>
      </div>

      <div className="relative h-[230px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-background/50">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,212,191,.22),transparent_38%),radial-gradient(circle_at_68%_42%,rgba(255,255,255,.13),transparent_28%),linear-gradient(180deg,rgba(14,165,233,.18),rgba(15,23,42,.7))]" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-70">
          <path d="M43 8 C55 10 69 14 76 28 C84 43 82 59 72 75 C62 92 43 94 28 82 C13 70 11 50 19 33 C25 20 31 9 43 8Z" fill="rgba(20,184,166,.22)" stroke="rgba(255,255,255,.28)" strokeWidth="0.7" />
          <path d="M31 18 C37 22 40 30 38 39 C36 48 28 55 22 62" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="0.5" />
          <path d="M58 20 C52 31 54 43 64 51 C74 59 70 72 61 83" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="0.5" />
        </svg>

        <div className="absolute left-[12%] top-[14%] rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-black text-white/70 backdrop-blur-xl">
          Koh Samui
        </div>

        {HOTSPOTS.map((spot, index) => (
          <motion.button
            key={spot.id}
            type="button"
            onClick={() => onSelect?.(spot)}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 400, damping: 22 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <span className={cn('absolute inset-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md', spot.glow)} />
            <span className={cn('relative grid h-7 w-7 place-items-center rounded-full border border-white/60 text-background shadow-[0_0_24px_rgba(255,255,255,.16)]', spot.glow)}>
              <MapPin className="h-3.5 w-3.5" />
            </span>
          </motion.button>
        ))}

        <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2">
          {HOTSPOTS.slice(0, 2).map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelect?.(spot)}
              className="rounded-2xl border border-white/10 bg-black/35 p-2 text-left backdrop-blur-xl"
            >
              <p className="truncate text-xs font-black text-white">{spot.name}</p>
              <p className="truncate text-[10px] text-white/60">{spot.people} active · {spot.type}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/35 px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-black text-foreground">
            {geo.latitude && geo.longitude ? 'Location radar enabled' : 'Enable location for nearby ranking'}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {network.online === false ? 'You are offline. Rooms will sync again later.' : 'Ready for live rooms, events and map-based discovery.'}
          </p>
        </div>
        {network.online === false ? <WifiOff className="h-4 w-4 text-destructive" /> : <Zap className="h-4 w-4 text-primary" />}
      </div>
    </section>
  );
}
