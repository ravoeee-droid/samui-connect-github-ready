import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { samuiVisuals } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';

export default function NewEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = useGame();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', category: 'social', samui_area: '', time_label: 'today', starts_at: '', max_people: '', is_paid: false,
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['my-profile-event'],
    queryFn: () => base44.entities.Profile.filter({ created_by_id: user?.id }),
    enabled: !!user,
  });
  const myProfile = profiles[0];

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await base44.entities.Event.create({
      ...form,
      max_people: form.max_people ? parseInt(form.max_people) : undefined,
      creator_name: myProfile?.display_name || 'Anonymous',
      creator_avatar: myProfile?.avatar_url || '',
    });
    game.award('post-event', 40);
    setSaving(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex items-center gap-3 overflow-hidden px-4 py-3 border-b border-border">
        <img src={samuiVisuals.events} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-background/75" />
        <button onClick={() => navigate(-1)} className="relative p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="relative font-semibold">Post Event · +40 XP</h1>
      </div>
      <div className="px-4 pt-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Title *</label>
          <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Sunset Beer in Lamai" className="bg-secondary border-0 rounded-xl h-12" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">When</label>
            <Select value={form.time_label} onValueChange={(v) => setForm(f => ({ ...f, time_label: v }))}>
              <SelectTrigger className="bg-secondary border-0 rounded-xl h-12"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="now">Now</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tonight">Tonight</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Area</label>
            <Select value={form.samui_area} onValueChange={(v) => setForm(f => ({ ...f, samui_area: v }))}>
              <SelectTrigger className="bg-secondary border-0 rounded-xl h-12"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Chaweng">Chaweng</SelectItem>
                <SelectItem value="Lamai">Lamai</SelectItem>
                <SelectItem value="Bophut">Bophut</SelectItem>
                <SelectItem value="Maenam">Maenam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Time</label>
            <Input value={form.starts_at} onChange={(e) => setForm(f => ({ ...f, starts_at: e.target.value }))} placeholder="e.g. 19:00" className="bg-secondary border-0 rounded-xl h-12" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Max people</label>
            <Input type="number" value={form.max_people} onChange={(e) => setForm(f => ({ ...f, max_people: e.target.value }))} placeholder="Optional" className="bg-secondary border-0 rounded-xl h-12" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
          <input type="checkbox" checked={form.is_paid} onChange={(e) => setForm(f => ({ ...f, is_paid: e.target.checked }))} className="rounded" />
          <span className="text-sm">This is a paid event</span>
        </div>
        <Button onClick={handleSubmit} disabled={!form.title.trim() || saving} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold">
          {saving ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Post Event</>}
        </Button>
      </div>
    </div>
  );
}