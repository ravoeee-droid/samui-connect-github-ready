import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, MessageCircle, Radar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { samuiVisuals } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const INTEREST_LABELS = {
  snorkeling: '🤿 Snorkeling', party: '🎉 Party', bars: '🍸 Bars',
  pool: '🏊 Pool', billiard: '🎱 Billiard', coworking: '💻 Coworking',
  website: '🌐 Website', designer: '🎨 Designer', 'social-media': '📱 Social Media',
  support: '🤝 Support',
};

const LANG_FLAGS = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', th: '🇹🇭', other: '🌍' };

const statusColors = {
  online: 'bg-primary',
  today: 'bg-accent',
  tonight: 'bg-purple-500',
  this_week: 'bg-amber-500',
  offline: 'bg-muted-foreground/50',
};

export default function Explore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = useGame();
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  const { data: allProfiles = [] } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: () => base44.entities.Profile.filter({ onboarding_complete: true }),
  });

  const profiles = useMemo(() => {
    return allProfiles.filter(p => {
      if (p.created_by_id === user?.id) return false;
      if (search && !p.display_name?.toLowerCase().includes(search.toLowerCase())) return false;
      if (langFilter !== 'all' && !p.languages?.includes(langFilter)) return false;
      if (areaFilter !== 'all' && p.samui_area !== areaFilter) return false;
      return true;
    });
  }, [allProfiles, search, langFilter, areaFilter, user]);

  const startDM = async (profile) => {
    game.award('dm-person', 30);
    const existing = await base44.entities.DirectThread.filter({
      participant_a_id: user.id,
      participant_b_id: profile.created_by_id,
    });
    const existing2 = await base44.entities.DirectThread.filter({
      participant_a_id: profile.created_by_id,
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
        participant_b_id: profile.created_by_id,
        participant_a_name: myProfile?.display_name || 'You',
        participant_b_name: profile.display_name,
        participant_a_avatar: myProfile?.avatar_url || '',
        participant_b_avatar: profile.avatar_url || '',
      });
      navigate(`/dm/${newThread.id}`);
    }
  };

  return (
    <div className="px-4 pt-5">
      <section className="relative mb-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-card p-4 shadow-[0_22px_70px_rgba(0,0,0,.28)]">
        <img src={samuiVisuals.social} alt="Koh Samui meetup" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
        <div className="relative">
          <div className="mb-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              <Radar className="h-3.5 w-3.5" /> Nearby people
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-bold text-white/85 backdrop-blur-xl">
              <Trophy className="h-3 w-3 text-primary" /> +30 XP DM
            </div>
          </div>
          <h1 className="font-heading text-2xl font-black leading-tight text-white">Explore Samui</h1>
          <p className="mt-1 max-w-xs text-sm text-white/70">Filter by language, area and vibe — then start a connection.</p>
        </div>
      </section>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full bg-secondary rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Select value={langFilter} onValueChange={setLangFilter}>
          <SelectTrigger className="flex-1 bg-secondary border-0 rounded-xl h-10">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="en">🇬🇧 English</SelectItem>
            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
            <SelectItem value="fr">🇫🇷 Français</SelectItem>
            <SelectItem value="ru">🇷🇺 Русский</SelectItem>
            <SelectItem value="th">🇹🇭 ไทย</SelectItem>
          </SelectContent>
        </Select>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="flex-1 bg-secondary border-0 rounded-xl h-10">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="Chaweng">Chaweng</SelectItem>
            <SelectItem value="Lamai">Lamai</SelectItem>
            <SelectItem value="Bophut">Bophut</SelectItem>
            <SelectItem value="Maenam">Maenam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* People Grid */}
      <div className="space-y-3">
        {profiles.map(profile => (
          <div key={profile.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50 hover:border-border transition-all">
            <div className="relative flex-shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">{profile.display_name?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <span className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card", statusColors[profile.status] || statusColors.offline)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-sm truncate">{profile.display_name}</span>
                <div className="flex gap-0.5">
                  {profile.languages?.slice(0, 2).map(l => (
                    <span key={l} className="text-xs">{LANG_FLAGS[l] || '🌍'}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {profile.interests?.slice(0, 2).map(i => (
                  <Badge key={i} variant="secondary" className="text-[10px] bg-secondary/80 py-0 h-5">
                    {INTEREST_LABELS[i] || i}
                  </Badge>
                ))}
                {profile.samui_area && (
                  <Badge variant="outline" className="text-[10px] border-border/50 py-0 h-5">
                    <MapPin className="w-2.5 h-2.5 mr-0.5" />{profile.samui_area}
                  </Badge>
                )}
              </div>
            </div>
            <button
              onClick={() => startDM(profile)}
              className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
        {profiles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No people found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}