import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, Globe2, Home, MessageCircle, ShieldCheck, Sparkles, Store, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n';
import { samuiVisuals } from '@/lib/visuals';

const featureCards = [
  { icon: Users, title: 'Connect', key: 'landing.people', gradient: 'from-cyan-400/20 to-primary/10' },
  { icon: Store, title: 'Rentals', key: 'landing.rentals', gradient: 'from-pink-400/20 to-primary/10' },
  { icon: CalendarDays, title: 'Events', key: 'landing.events', gradient: 'from-yellow-400/20 to-primary/10' },
];

export default function Landing() {
  const { t } = useLanguage();

  const requestProvider = () => {
    const text = encodeURIComponent(t('whatsapp.providerIntro'));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_0%,hsl(var(--primary)/.22),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(236,72,153,.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.04),transparent_44%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link to="/landing" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_15px_45px_hsl(var(--primary)/.35)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-lg font-black leading-none">Samui Connect</p>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Island App</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <Button asChild variant="secondary" className="hidden rounded-full font-black md:inline-flex">
            <Link to="/login">{t('login.submit')}</Link>
          </Button>
          <Button asChild className="rounded-full font-black">
            <Link to="/login">{t('landing.openApp')}</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-6 md:grid-cols-[1.05fr_.95fr] md:px-8 md:pb-24 md:pt-14">
          <div>
            <Badge className="mb-5 border-primary/30 bg-primary/15 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
              <Globe2 className="mr-1.5 h-3.5 w-3.5" /> {t('landing.badge')}
            </Badge>

            <h1 className="max-w-4xl font-heading text-4xl font-black leading-[0.92] tracking-tight md:text-7xl">
              {t('landing.title')}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
              {t('landing.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-2xl px-7 text-base font-black">
                <Link to="/login">
                  {t('landing.join')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button onClick={requestProvider} size="lg" variant="outline" className="h-14 rounded-2xl border-white/15 bg-card/70 px-7 text-base font-black backdrop-blur-xl">
                <MessageCircle className="mr-2 h-5 w-5" /> {t('landing.provider')}
              </Button>
            </div>

            <div className="mt-7 rounded-3xl border border-white/10 bg-card/70 p-4 shadow-[0_22px_70px_rgba(0,0,0,.25)] backdrop-blur-2xl">
              <p className="text-sm font-black text-foreground">{t('landing.features')}</p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {t('landing.trust')}
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -left-10 top-12 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -right-10 bottom-20 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />

            <div className="relative rounded-[2.4rem] border border-white/10 bg-card/65 p-3 shadow-[0_30px_100px_rgba(0,0,0,.42)] backdrop-blur-2xl">
              <div className="overflow-hidden rounded-[2rem] border border-white/10">
                <img src={samuiVisuals.hero || samuiVisuals.party || samuiVisuals.stays} alt="Koh Samui app preview" className="h-[480px] w-full object-cover md:h-[610px]" />
                <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-t from-black/88 via-black/22 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="mb-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">Live rooms</Badge>
                    <Badge variant="secondary">Rentals</Badge>
                    <Badge variant="secondary">Events</Badge>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/45 p-4 text-white backdrop-blur-xl">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Today on Samui</p>
                    <p className="mt-1 text-2xl font-black">Beach meetup · Scooter nearby · Sunset dinner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Platform</p>
              <h2 className="mt-2 font-heading text-3xl font-black md:text-5xl">{t('landing.sectionTitle')}</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, key, gradient }) => (
              <div key={title} className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${gradient} p-6 shadow-[0_18px_60px_rgba(0,0,0,.25)]`}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-card/80">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(key)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
          <div className="overflow-hidden rounded-[2.3rem] border border-primary/20 bg-primary/10 p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  <Store className="mr-1.5 h-3.5 w-3.5" /> Provider
                </Badge>
                <h2 className="font-heading text-3xl font-black md:text-5xl">{t('landing.providerTitle')}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{t('landing.providerText')}</p>
              </div>
              <Button onClick={requestProvider} size="lg" className="h-14 rounded-2xl px-7 font-black">
                {t('landing.providerCta')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© Samui Connect</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/provider" className="hover:text-foreground">Provider</Link>
            <Link to="/login" className="hover:text-foreground">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
