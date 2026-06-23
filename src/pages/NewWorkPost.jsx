import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Briefcase } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { samuiVisuals } from '@/lib/visuals';
import { useGame } from '@/lib/gamification';

const CATEGORIES = ['Website', 'Designer', 'Social Media', 'Fotograf', 'Ads/Marketing', 'VA/Support', 'Sales/Closer', 'Branding', 'Content Creation', 'Video Editing', 'Automation', 'Leadgen', 'Other'];

export default function NewWorkPost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = useGame();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'request', format: 'Suche', category: '', description: '', samui_area: '',
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['my-profile-work'],
    queryFn: () => base44.entities.Profile.filter({ created_by_id: user?.id }),
    enabled: !!user,
  });
  const myProfile = profiles[0];

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.category) return;
    setSaving(true);
    await base44.entities.WorkPost.create({
      ...form,
      creator_name: myProfile?.display_name || 'Anonymous',
      creator_avatar: myProfile?.avatar_url || '',
    });
    game.award('post-event', 40);
    setSaving(false);
    navigate('/work');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex items-center gap-3 overflow-hidden px-4 py-3 border-b border-border">
        <img src={samuiVisuals.work} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-background/75" />
        <button onClick={() => navigate(-1)} className="relative p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="relative font-semibold">Post Work Request · +40 XP</h1>
      </div>
      <div className="px-4 pt-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Title *</label>
          <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Looking for web designer" className="bg-secondary border-0 rounded-xl h-12" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Type</label>
            <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger className="bg-secondary border-0 rounded-xl h-12"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="request">Request</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Format</label>
            <Select value={form.format} onValueChange={(v) => setForm(f => ({ ...f, format: v }))}>
              <SelectTrigger className="bg-secondary border-0 rounded-xl h-12"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Suche">Suche</SelectItem>
                <SelectItem value="Biete">Biete</SelectItem>
                <SelectItem value="Collab">Collab</SelectItem>
                <SelectItem value="Empfehlung gesucht">Empfehlung gesucht</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Category *</label>
          <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
            <SelectTrigger className="bg-secondary border-0 rounded-xl h-12"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Description</label>
          <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what you need..." className="bg-secondary border-0 rounded-xl" rows={3} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Area</label>
          <Select value={form.samui_area} onValueChange={(v) => setForm(f => ({ ...f, samui_area: v }))}>
            <SelectTrigger className="bg-secondary border-0 rounded-xl h-12"><SelectValue placeholder="Select area" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="Chaweng">Chaweng</SelectItem>
              <SelectItem value="Lamai">Lamai</SelectItem>
              <SelectItem value="Bophut">Bophut</SelectItem>
              <SelectItem value="Maenam">Maenam</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSubmit} disabled={!form.title.trim() || !form.category || saving} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold">
          {saving ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Briefcase className="w-4 h-4 mr-2" /> Post</>}
        </Button>
      </div>
    </div>
  );
}