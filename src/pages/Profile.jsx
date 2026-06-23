import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  LogOut, Camera, MapPin, Edit3, Check, X
} from 'lucide-react';
import LevelCard from '@/components/gamification/LevelCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n';
import { samuiVisuals } from '@/lib/visuals';

const INTEREST_LABELS = {
  snorkeling: '🤿 Snorkeling', party: '🎉 Party', bars: '🍸 Bars',
  pool: '🏊 Pool', billiard: '🎱 Billiard', coworking: '💻 Coworking',
  website: '🌐 Website', designer: '🎨 Designer', 'social-media': '📱 Social Media',
  support: '🤝 Support',
};

const LANG_FLAGS = { en: '🇬🇧 English', de: '🇩🇪 Deutsch', fr: '🇫🇷 Français', ru: '🇷🇺 Русский', th: '🇹🇭 Thai', other: '🌍 Other' };

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const { data: profiles = [], isLoading: profileLoading } = useQuery({
    queryKey: ['my-profile-page'],
    queryFn: () => base44.entities.Profile.filter({ created_by_id: user?.id }),
    enabled: !!user,
  });
  const profile = profiles[0];

  useEffect(() => {
    if (!profileLoading && user && profiles.length === 0) {
      navigate('/onboarding');
    }
  }, [profileLoading, user, profiles, navigate]);

  const startEdit = () => {
    setEditData({
      display_name: profile?.display_name || '',
      bio: profile?.bio || '',
      samui_area: profile?.samui_area || '',
      status: profile?.status || 'online',
      work_activity: profile?.work_activity || '',
      contact_instagram: profile?.contact_instagram || '',
      contact_website: profile?.contact_website || '',
      contact_whatsapp: profile?.contact_whatsapp || '',
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (profile) {
      await base44.entities.Profile.update(profile.id, editData);
    }
    setEditing(false);
    queryClient.invalidateQueries({ queryKey: ['my-profile-page'] });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Profile.update(profile.id, { avatar_url: file_url });
    queryClient.invalidateQueries({ queryKey: ['my-profile-page'] });
  };

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  if (profileLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <section className="relative -mx-1 mb-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-card p-4">
        <img src={samuiVisuals.social} alt="Samui profile background" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative flex justify-between items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Island Identity</p>
            <h1 className="text-2xl font-black font-heading mt-1">Profile</h1>
          </div>
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-black/25 p-1 backdrop-blur-xl">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="p-2 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={saveEdit} className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20">
                <Check className="w-5 h-5 text-primary" />
              </button>
            </>
          ) : (
            <button onClick={startEdit} className="p-2 rounded-lg hover:bg-secondary">
              <Edit3 className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
        </div>
      </section>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-3">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/30" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center ring-2 ring-border">
              <span className="text-3xl font-bold text-muted-foreground">{profile.display_name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-lg">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        {editing ? (
          <Input
            value={editData.display_name}
            onChange={(e) => setEditData(d => ({ ...d, display_name: e.target.value }))}
            className="text-center text-lg font-bold bg-secondary border-0 rounded-xl max-w-[200px]"
          />
        ) : (
          <h2 className="text-lg font-bold">{profile.display_name}</h2>
        )}

        <div className="flex gap-2 mt-2">
          {profile.languages?.map(l => (
            <Badge key={l} variant="secondary" className="text-xs bg-secondary/80">{LANG_FLAGS[l] || l}</Badge>
          ))}
        </div>
      </div>

      <LevelCard className="mb-5" />

      {/* Info Cards */}
      <div className="space-y-3">

        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium">{t('language.title')}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{t('language.subtitle')}</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Bio */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <p className="text-xs text-muted-foreground mb-2 font-medium">About</p>
          {editing ? (
            <Textarea
              value={editData.bio}
              onChange={(e) => setEditData(d => ({ ...d, bio: e.target.value }))}
              placeholder="Tell people about yourself..."
              className="bg-secondary border-0 rounded-xl text-sm"
              rows={3}
            />
          ) : (
            <p className="text-sm text-foreground">{profile.bio || 'No bio yet'}</p>
          )}
        </div>

        {/* Status & Area */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">Status</p>
              {editing ? (
                <Select value={editData.status} onValueChange={(v) => setEditData(d => ({ ...d, status: v }))}>
                  <SelectTrigger className="bg-secondary border-0 rounded-xl h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="online">🟢 Online</SelectItem>
                    <SelectItem value="today">🔵 Today</SelectItem>
                    <SelectItem value="tonight">🟣 Tonight</SelectItem>
                    <SelectItem value="this_week">🟡 This Week</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="secondary" className="text-xs">{profile.status || 'online'}</Badge>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">Area</p>
              {editing ? (
                <Select value={editData.samui_area} onValueChange={(v) => setEditData(d => ({ ...d, samui_area: v }))}>
                  <SelectTrigger className="bg-secondary border-0 rounded-xl h-9 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Chaweng">Chaweng</SelectItem>
                    <SelectItem value="Lamai">Lamai</SelectItem>
                    <SelectItem value="Bophut">Bophut</SelectItem>
                    <SelectItem value="Maenam">Maenam</SelectItem>
                    <SelectItem value="Just Traveling">Just Traveling</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  {profile.samui_area || 'Not set'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests?.map(i => (
              <Badge key={i} variant="secondary" className="text-xs bg-secondary/80">{INTEREST_LABELS[i] || i}</Badge>
            ))}
            {(!profile.interests || profile.interests.length === 0) && (
              <span className="text-xs text-muted-foreground">No interests selected</span>
            )}
          </div>
        </div>

        {/* Work section */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Work</p>
          {editing ? (
            <Input
              value={editData.work_activity}
              onChange={(e) => setEditData(d => ({ ...d, work_activity: e.target.value }))}
              placeholder="What do you do?"
              className="bg-secondary border-0 rounded-xl text-sm"
            />
          ) : (
            <p className="text-sm text-foreground">{profile.work_activity || 'Not set'}</p>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>

      <div className="h-8" />
    </div>
  );
}