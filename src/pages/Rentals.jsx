import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bike,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Filter,
  Home,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wifi,
} from 'lucide-react';
import { samuiVisuals } from '@/lib/visuals';
import { cn } from '@/lib/utils';
import { useGame } from '@/lib/gamification';

const locations = ['All', 'Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Bangrak'];
const priceFilters = ['All', 'Budget', 'Monthly', 'Luxury', 'Verified'];

const vehicles = [
  {
    id: 'v1',
    type: 'Scooter',
    title: 'Honda Click 125cc',
    location: 'Chaweng',
    price: '250 THB / day',
    monthly: '4,500 THB / month',
    image: samuiVisuals.scooter,
    tags: ['Helmet included', 'Monthly deal', 'No passport hold'],
    verified: true,
    rating: 4.9,
    badge: 'Most requested',
  },
  {
    id: 'v2',
    type: 'Scooter',
    title: 'Premium Island Scooter',
    location: 'Lamai',
    price: '300 THB / day',
    monthly: '5,900 THB / month',
    image: samuiVisuals.vehicles,
    tags: ['New model', 'Drop-off available', 'Damage photos'],
    verified: true,
    rating: 4.8,
    badge: 'Verified partner',
  },
  {
    id: 'v3',
    type: 'Car',
    title: 'Compact SUV · Aircon',
    location: 'Bophut',
    price: '1,200 THB / day',
    monthly: '28,000 THB / month',
    image: samuiVisuals.vehicles,
    tags: ['Insurance option', 'Family friendly', 'Airport pickup'],
    verified: true,
    rating: 4.7,
    badge: 'Family pick',
  },
];

const stays = [
  {
    id: 's1',
    type: 'Villa',
    title: 'Sunset Pool Villa',
    location: 'Bophut',
    price: '85,000 THB / month',
    nightly: '5,900 THB / night',
    image: samuiVisuals.villa,
    tags: ['Infinity pool', 'Ocean view', 'Fast WiFi'],
    verified: true,
    rating: 4.9,
    badge: 'Luxury stay',
  },
  {
    id: 's2',
    type: 'Apartment',
    title: 'Nomad Sea View Apartment',
    location: 'Lamai',
    price: '29,000 THB / month',
    nightly: '1,900 THB / night',
    image: samuiVisuals.stays,
    tags: ['Monthly', 'Kitchen', 'Coworking nearby'],
    verified: true,
    rating: 4.8,
    badge: 'Monthly deal',
  },
  {
    id: 's3',
    type: 'Family Stay',
    title: 'Family Garden Home',
    location: 'Maenam',
    price: '42,000 THB / month',
    nightly: '2,800 THB / night',
    image: samuiVisuals.familyStay,
    tags: ['Family friendly', 'Quiet area', 'School nearby'],
    verified: true,
    rating: 4.8,
    badge: 'Long-term ready',
  },
];

const buildWhatsAppMessage = (listing, request) => {
  const lines = [
    `Hi, I found ${listing.title} on Samui Connect.`,
    `Location: ${listing.location}`,
    `Price: ${listing.price}`,
    request.date ? `Date: ${request.date}` : null,
    request.duration ? `Duration: ${request.duration}` : null,
    request.name ? `Name: ${request.name}` : null,
    request.note ? `Message: ${request.note}` : null,
  ].filter(Boolean);
  return encodeURIComponent(lines.join('\n'));
};

function ListingCard({ item, mode, onRequest }) {
  const Icon = mode === 'vehicles' ? (item.type === 'Car' ? Car : Bike) : Building2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-card shadow-[0_22px_70px_rgba(0,0,0,.26)]"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="border-white/15 bg-black/45 text-white backdrop-blur-xl">
            <Icon className="mr-1 h-3 w-3" /> {item.type}
          </Badge>
          {item.verified && (
            <Badge className="border-primary/35 bg-primary/20 text-primary backdrop-blur-xl">
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">{item.badge}</p>
          <h3 className="mt-1 font-heading text-xl font-black leading-tight text-white">{item.title}</h3>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-black text-foreground">{item.price}</p>
            <p className="text-xs text-muted-foreground">{mode === 'vehicles' ? item.monthly : item.nightly}</p>
          </div>
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-right">
            <div className="flex items-center gap-1 text-xs font-black text-yellow-300"><Star className="h-3 w-3 fill-current" /> {item.rating}</div>
            <p className="text-[10px] text-yellow-100/60">trusted</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" /> {item.location}
        </div>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-secondary/70 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <Button onClick={() => onRequest(item)} className="h-12 w-full rounded-2xl font-black shadow-[0_0_22px_hsl(var(--primary)/0.22)]">
          <MessageCircle className="mr-2 h-4 w-4" /> Check Availability
        </Button>
      </div>
    </motion.article>
  );
}

export default function Rentals() {
  const [tab, setTab] = useState('vehicles');
  const [location, setLocation] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [request, setRequest] = useState({ name: '', date: '', duration: '', note: '' });
  const game = useGame();

  const activeData = tab === 'vehicles' ? vehicles : stays;
  const filtered = useMemo(() => activeData.filter((item) => {
    const matchLocation = location === 'All' || item.location === location;
    const matchSearch = !search || `${item.title} ${item.location} ${item.type} ${item.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase());
    const matchPrice = priceFilter === 'All'
      || (priceFilter === 'Verified' && item.verified)
      || (priceFilter === 'Monthly' && /month/i.test(item.price))
      || (priceFilter === 'Luxury' && (item.type === 'Villa' || item.type === 'Car'))
      || (priceFilter === 'Budget' && (item.type === 'Scooter' || item.type === 'Apartment'));
    return matchLocation && matchSearch && matchPrice;
  }), [activeData, location, priceFilter, search]);

  const submitRequest = () => {
    if (!selected) return;
    game.award('rental-request', 35, { once: false, label: `Rental request: ${selected.title}`, emoji: selected.type === 'Villa' ? '🏝️' : '🛵' });
    const text = buildWhatsAppMessage(selected, request);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    setSelected(null);
    setRequest({ name: '', date: '', duration: '', note: '' });
  };

  return (
    <div className="px-4 pt-5">
      <section className="relative mb-5 overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-[0_28px_80px_rgba(0,0,0,.34)]">
        <img src={tab === 'vehicles' ? samuiVisuals.vehicles : samuiVisuals.stays} alt="Samui rentals" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-background/20 to-background" />
        <div className="relative p-4 pb-5">
          <div className="mb-20 flex items-center justify-between">
            <Badge className="border-primary/30 bg-primary/15 text-[10px] font-black uppercase tracking-[0.16em] text-primary backdrop-blur-xl">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Island Marketplace
            </Badge>
            <Badge variant="outline" className="border-white/15 bg-black/35 text-white backdrop-blur-xl">
              +35 XP/request
            </Badge>
          </div>
          <h1 className="font-heading text-3xl font-black leading-[0.98] text-white drop-shadow-lg">
            Rent vehicles & find stays on Samui
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">
            Verified scooters, cars, villas and monthly stays. Fast WhatsApp requests without booking chaos.
          </p>
        </div>
      </section>

      <Tabs value={tab} onValueChange={setTab} className="mb-5">
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl border border-white/10 bg-secondary/60 p-1">
          <TabsTrigger value="vehicles" className="rounded-xl font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bike className="mr-2 h-4 w-4" /> Vehicles
          </TabsTrigger>
          <TabsTrigger value="stays" className="rounded-xl font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Home className="mr-2 h-4 w-4" /> Stays
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === 'vehicles' ? 'Search scooter, car, Chaweng...' : 'Search villa, apartment, monthly...'}
              className="h-12 rounded-2xl border-white/10 bg-card/70 pl-11 font-semibold"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {locations.map((item) => (
              <button key={item} onClick={() => setLocation(item)} className={cn('whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition-all', location === item ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>
                <MapPin className="mr-1 inline h-3 w-3" /> {item}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {priceFilters.map((item) => (
              <button key={item} onClick={() => setPriceFilter(item)} className={cn('whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition-all', priceFilter === item ? 'bg-white text-black' : 'bg-secondary text-muted-foreground')}>
                <Filter className="mr-1 inline h-3 w-3" /> {item}
              </button>
            ))}
          </div>
        </div>

        <TabsContent value="vehicles" className="mt-5 space-y-4">
          {filtered.map((item) => <ListingCard key={item.id} item={item} mode="vehicles" onRequest={setSelected} />)}
        </TabsContent>
        <TabsContent value="stays" className="mt-5 space-y-4">
          {filtered.map((item) => <ListingCard key={item.id} item={item} mode="stays" onRequest={setSelected} />)}
        </TabsContent>
      </Tabs>

      <div className="mb-8 rounded-[1.5rem] border border-primary/15 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-black text-foreground">Trust-first marketplace</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Clear prices, verified providers, WhatsApp request flow and no direct payment until the offer is confirmed.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-24px)] overflow-y-auto rounded-[1.7rem] border-white/10 bg-card p-0 sm:max-w-md">
          {selected && (
            <>
              <div className="relative h-44 overflow-hidden rounded-t-[1.7rem]">
                <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Request availability</p>
                  <DialogHeader className="mt-1 text-left">
                    <DialogTitle className="font-heading text-xl font-black text-white">{selected.title}</DialogTitle>
                    <DialogDescription className="text-white/70">{selected.location} · {selected.price}</DialogDescription>
                  </DialogHeader>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <Input placeholder="Your name" value={request.name} onChange={(e) => setRequest({ ...request, name: e.target.value })} className="h-11 rounded-xl" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Date" value={request.date} onChange={(e) => setRequest({ ...request, date: e.target.value })} className="h-11 rounded-xl pl-9" />
                  </div>
                  <Input placeholder="Duration" value={request.duration} onChange={(e) => setRequest({ ...request, duration: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <Textarea placeholder="Short message: pickup area, monthly request, special needs..." value={request.note} onChange={(e) => setRequest({ ...request, note: e.target.value })} className="min-h-24 rounded-xl" />
                <div className="rounded-xl border border-white/10 bg-secondary/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-black text-foreground"><Wifi className="h-4 w-4 text-primary" /> Fast request, no payment in app</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">This opens WhatsApp with a ready-made message. Later this can become a provider dashboard.</p>
                </div>
                <Button onClick={submitRequest} className="h-12 w-full rounded-2xl font-black">
                  <MessageCircle className="mr-2 h-4 w-4" /> Send WhatsApp Request
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
