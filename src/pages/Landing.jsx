import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Flame, MessageCircle, Sparkles, Trophy, Users, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44, isDemoMode } from '@/api/base44Client';
import { samuiVisuals } from '@/lib/visuals';

const features = [
  { icon: MessageCircle, title: 'Live Chat Rooms', desc: 'Jump into Snorkeling, Party, Bars or Coworking and meet people instantly.', image: samuiVisuals.activities },
  { icon: Users, title: 'Meet People Today', desc: 'See who is around Chaweng, Lamai, Bophut or Maenam right now.', image: samuiVisuals.social },
  { icon: Briefcase, title: 'Work Connect', desc: 'Find creators, founders, freelancers and island collaborations on Samui.', image: samuiVisuals.work },
];

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode) return;
    base44.auth.isAuthenticated()
      .then((isAuth) => { if (isAuth) navigate('/'); })
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_5%,hsl(var(--primary)/.25),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(236,72,153,.22),transparent_28%),linear-gradient(180deg,rgba(4,8,18,.1),hsl(var(--background))_65%)]" />

      <main className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-8 pt-5">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-[0_30px_100px_rgba(0,0,0,.45)]"
        >
          <div className="relative h-[430px]">
            <img
              src={samuiVisuals.hero}
              alt="People connecting at a tropical Koh Samui beach club"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-background" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-2 backdrop-blur-xl">
                <Waves className="h-4 w-4 text-primary" />
                <span className="text-xs font-black tracking-wide">Samui Connect</span>
              </div>
              <div className="rounded-full border border-primary/30 bg-primary/15 px-3 py-2 text-[11px] font-black text-primary backdrop-blur-xl">
                LIVE NOW
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Meet your island people
              </div>
              <h1 className="font-heading text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-xl">
                Find People on <span className="text-primary">Koh Samui</span> — Today
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/78">
                Snorkeling, party, coworking, bars and real connections. Join rooms, collect XP and level up your island life.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-xl">
                  <p className="text-lg font-black text-white">24/7</p>
                  <p className="text-[10px] text-white/60">live rooms</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-xl">
                  <p className="text-lg font-black text-white">XP</p>
                  <p className="text-[10px] text-white/60">level system</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-xl">
                  <p className="text-lg font-black text-white">B2B</p>
                  <p className="text-[10px] text-white/60">work connects</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-4 grid gap-3"
        >
          {features.map(({ icon: Icon, title, desc, image }) => (
            <div key={title} className="group grid grid-cols-[92px_1fr] overflow-hidden rounded-[1.35rem] border border-border/60 bg-card/85 shadow-[0_18px_50px_rgba(0,0,0,.22)] backdrop-blur-xl">
              <div className="relative min-h-[92px] overflow-hidden">
                <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/45 to-transparent" />
              </div>
              <div className="flex items-start gap-3 p-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-4 rounded-[1.5rem] border border-primary/15 bg-primary/10 p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary"><Trophy className="h-3.5 w-3.5" /> Level up</p>
              <h2 className="mt-1 text-lg font-black">Collect XP for every connection</h2>
              <p className="mt-1 text-xs text-muted-foreground">Check in, join rooms, send DMs and unlock visibility boosts.</p>
            </div>
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-background/70 text-center ring-1 ring-primary/20">
              <Flame className="h-6 w-6 text-orange-300" />
              <span className="text-[10px] font-black text-primary">STREAK</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-auto space-y-3 pt-5"
        >
          <Link
            to={isDemoMode ? "/" : "/register"}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-[0_0_28px_hsl(var(--primary)/0.35)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_38px_hsl(var(--primary)/0.45)]"
          >
            {isDemoMode ? 'Open demo app' : 'Start connecting'}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-secondary py-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
          >
            Already have an account? Log In
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
