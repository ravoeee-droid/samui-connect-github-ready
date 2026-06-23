import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, MessageCircle, Plus, ShieldCheck, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n';

const cards = [
  { label: 'Active listings', value: '0', note: 'Vehicles, stays, experiences' },
  { label: 'New requests', value: '0', note: 'WhatsApp leads will appear here later' },
  { label: 'Featured slots', value: 'Ready', note: 'Prepared for paid placements' },
];

export default function ProviderDashboard() {
  const { t } = useLanguage();

  const provider = () => {
    const text = encodeURIComponent(t('whatsapp.providerIntro'));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-black">Samui Connect</Link>
          <LanguageSwitcher compact />
        </div>

        <section className="overflow-hidden rounded-[2.3rem] border border-white/10 bg-card p-6 shadow-[0_24px_80px_rgba(0,0,0,.3)] md:p-10">
          <Badge className="mb-5 bg-primary text-primary-foreground">
            <Store className="mr-1.5 h-3.5 w-3.5" /> Provider Dashboard
          </Badge>
          <h1 className="font-heading text-4xl font-black md:text-6xl">List vehicles, stays and experiences on Samui.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            This area prepares the provider business model: listings, requests, verification, featured placements and WhatsApp lead management.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-secondary/40 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">{card.label}</p>
                <p className="mt-2 font-heading text-3xl font-black">{card.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Button onClick={provider} className="h-13 rounded-2xl font-black">
              <MessageCircle className="mr-2 h-5 w-5" /> Request provider access
            </Button>
            <Button disabled variant="secondary" className="h-13 rounded-2xl font-black">
              <Plus className="mr-2 h-5 w-5" /> Add listing soon
            </Button>
            <Button disabled variant="outline" className="h-13 rounded-2xl font-black">
              <BarChart3 className="mr-2 h-5 w-5" /> Analytics soon
            </Button>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-primary/20 bg-primary/10 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-sm font-black">Prepared for verification</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                The next backend phase should add provider verification, listing approval, request inbox, status tracking and paid featured placements.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
