import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import WorkPostCard from '@/components/work/WorkPostCard';
import LevelCard from '@/components/gamification/LevelCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Briefcase, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { samuiVisuals } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';

export default function Work() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = useGame();
  const [tab, setTab] = useState('all');

  const { data: posts = [] } = useQuery({
    queryKey: ['work-posts'],
    queryFn: () => base44.entities.WorkPost.list('-created_date', 50),
  });

  const filtered = tab === 'all' ? posts : posts.filter(p => p.type === tab);

  const handleContact = async (post) => {
    game.award('dm-person', 30);
    if (!post.created_by_id || post.created_by_id === user?.id) return;
    
    const existing = await base44.entities.DirectThread.filter({
      participant_a_id: user.id,
      participant_b_id: post.created_by_id,
    });
    const existing2 = await base44.entities.DirectThread.filter({
      participant_a_id: post.created_by_id,
      participant_b_id: user.id,
    });
    const thread = existing[0] || existing2[0];
    if (thread) {
      navigate(`/dm/${thread.id}`);
    } else {
      const myProfiles = await base44.entities.Profile.filter({ created_by_id: user.id });
      const myProfile = myProfiles[0];
      const newThread = await base44.entities.DirectThread.create({
        participant_a_id: user.id,
        participant_b_id: post.created_by_id,
        participant_a_name: myProfile?.display_name || 'You',
        participant_b_name: post.creator_name || 'Unknown',
        participant_a_avatar: myProfile?.avatar_url || '',
        participant_b_avatar: post.creator_avatar || '',
        last_message: `Re: ${post.title}`,
      });
      navigate(`/dm/${newThread.id}`);
    }
  };

  return (
    <div className="px-4 pt-5">
      <section className="relative mb-5 overflow-hidden rounded-[1.9rem] border border-white/10 bg-card shadow-[0_24px_75px_rgba(0,0,0,.3)]">
        <img src={samuiVisuals.work} alt="Samui work connect" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-black/20" />
        <div className="relative p-4">
          <div className="mb-20 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-amber-200">
              <Briefcase className="h-3.5 w-3.5" /> Work Connect
            </div>
            <Link
              to="/work/new"
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground shadow-[0_0_22px_hsl(var(--primary)/.35)]"
            >
              <Plus className="h-3.5 w-3.5" /> Post
            </Link>
          </div>
          <h1 className="font-heading text-2xl font-black leading-tight text-white">Find island talent, jobs and collabs.</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">Creators, founders, freelancers and local operators — all in one B2B island feed.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold text-white/80 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Contact someone and earn +30 XP
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </section>

      <LevelCard compact className="mb-5" />

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-secondary p-1">
          <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
          <TabsTrigger value="request" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Requests</TabsTrigger>
          <TabsTrigger value="offer" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Offers</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.map(post => (
          <WorkPostCard key={post.id} post={post} onContact={handleContact} />
        ))}
        {filtered.length === 0 && (
          <div className="relative overflow-hidden rounded-[1.7rem] border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
            <img src={samuiVisuals.work} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="relative">
              <p className="font-bold text-foreground">No work posts yet — be the first island connector.</p>
              <p className="mt-1 text-xs">Post a request or offer and turn the feed alive.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
