import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n';

export default function Contact() {
  const { t } = useLanguage();

  const provider = () => {
    const text = encodeURIComponent(t('whatsapp.providerIntro'));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-black">Samui Connect</Link>
          <LanguageSwitcher compact />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-[0_20px_70px_rgba(0,0,0,.28)] md:p-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-heading text-4xl font-black">Contact Samui Connect</h1>
          <p className="mt-4 text-muted-foreground">
            For provider access, partnerships, rentals, stays or early feedback.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <Button onClick={provider} className="h-14 rounded-2xl font-black">
              <Store className="mr-2 h-5 w-5" /> {t('landing.providerCta')}
            </Button>
            <Button onClick={() => window.open('https://wa.me/?text=Hi%20Samui%20Connect', '_blank')} variant="outline" className="h-14 rounded-2xl font-black">
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
            </Button>
          </div>

          <Button asChild variant="secondary" className="mt-6 rounded-2xl font-black">
            <Link to="/">Back to landingpage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
