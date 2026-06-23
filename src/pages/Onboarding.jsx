import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Camera, Upload, ArrowRight, Check, MapPin, Sparkles } from 'lucide-react';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'other', label: 'Other', flag: '🌍' },
];

const INTERESTS = [
  { id: 'snorkeling', label: 'Snorkeling', emoji: '🤿' },
  { id: 'party', label: 'Party', emoji: '🎉' },
  { id: 'bars', label: 'Bars', emoji: '🍸' },
  { id: 'pool', label: 'Pool', emoji: '🏊' },
  { id: 'billiard', label: 'Billiard', emoji: '🎱' },
  { id: 'coworking', label: 'Coworking', emoji: '💻' },
  { id: 'website', label: 'Website', emoji: '🌐' },
  { id: 'designer', label: 'Designer', emoji: '🎨' },
  { id: 'social-media', label: 'Social Media', emoji: '📱' },
  { id: 'support', label: 'Support', emoji: '🤝' },
];

const AREAS = [
  { id: 'Chaweng', label: 'Chaweng', desc: 'Main hub, lively' },
  { id: 'Lamai', label: 'Lamai', desc: 'Chill vibes' },
  { id: 'Bophut', label: 'Bophut', desc: 'Fisherman village' },
  { id: 'Maenam', label: 'Maenam', desc: 'Quiet & local' },
  { id: 'Just Traveling', label: 'Just Traveling', desc: 'No fixed spot' },
];

const pageVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    display_name: '',
    avatar_url: '',
    languages: [],
    interests: [],
    samui_area: '',
  });
  const [saving, setSaving] = useState(false);

  const totalSteps = 5;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setProfile(p => ({ ...p, avatar_url: file_url }));
  };

  const toggleLanguage = (code) => {
    setProfile(p => ({
      ...p,
      languages: p.languages.includes(code)
        ? p.languages.filter(l => l !== code)
        : [...p.languages, code],
    }));
  };

  const toggleInterest = (id) => {
    setProfile(p => {
      const has = p.interests.includes(id);
      if (has) return { ...p, interests: p.interests.filter(i => i !== id) };
      if (p.interests.length >= 3) return p;
      return { ...p, interests: [...p.interests, id] };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return profile.display_name.trim().length >= 2;
      case 1: return true; // photo optional
      case 2: return profile.languages.length > 0;
      case 3: return profile.interests.length >= 1;
      case 4: return true; // area optional
      default: return false;
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    await base44.entities.Profile.create({
      ...profile,
      onboarding_complete: true,
      status: 'online',
    });
    setSaving(false);
    navigate('/');
  };

  const next = () => {
    if (step < totalSteps - 1) setStep(s => s + 1);
    else handleFinish();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingProgress current={step} total={totalSteps} />

      <div className="flex-1 flex flex-col px-6 pt-8 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {step === 0 && (
              <div className="flex-1 flex flex-col">
                <h1 className="text-2xl font-bold font-heading mb-2">What's your name?</h1>
                <p className="text-muted-foreground mb-8">How should others see you</p>
                <Input
                  value={profile.display_name}
                  onChange={(e) => setProfile(p => ({ ...p, display_name: e.target.value }))}
                  placeholder="Your display name"
                  className="h-14 text-lg bg-secondary border-0 rounded-xl"
                  autoFocus
                />
              </div>
            )}

            {step === 1 && (
              <div className="flex-1 flex flex-col items-center">
                <h1 className="text-2xl font-bold font-heading mb-2 text-center">Show who you are</h1>
                <p className="text-muted-foreground mb-8 text-center">A photo builds trust and visibility</p>
                
                <div className="relative w-32 h-32 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center mb-6 overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="font-medium">Upload Photo</span>
                  </div>
                </label>

                <button
                  onClick={next}
                  className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip for now
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col">
                <h1 className="text-2xl font-bold font-heading mb-2">Your languages</h1>
                <p className="text-muted-foreground mb-8">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                        profile.languages.includes(lang.code)
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-secondary border-transparent hover:border-border"
                      )}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      {profile.languages.includes(lang.code) && (
                        <Check className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1 flex flex-col">
                <h1 className="text-2xl font-bold font-heading mb-2">What are you here for?</h1>
                <p className="text-muted-foreground mb-8">Pick 1–3 interests</p>
                <div className="grid grid-cols-2 gap-3">
                  {INTERESTS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                        profile.interests.includes(item.id)
                          ? "bg-primary/10 border-primary"
                          : "bg-secondary border-transparent hover:border-border"
                      )}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                      {profile.interests.includes(item.id) && (
                        <Check className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1 flex flex-col">
                <h1 className="text-2xl font-bold font-heading mb-2">Where on Samui?</h1>
                <p className="text-muted-foreground mb-8">Optional — helps find people nearby</p>
                <div className="space-y-3">
                  {AREAS.map(area => (
                    <button
                      key={area.id}
                      onClick={() => setProfile(p => ({ ...p, samui_area: p.samui_area === area.id ? '' : area.id }))}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                        profile.samui_area === area.id
                          ? "bg-primary/10 border-primary"
                          : "bg-secondary border-transparent hover:border-border"
                      )}
                    >
                      <MapPin className={cn("w-5 h-5", profile.samui_area === area.id ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <p className="font-medium">{area.label}</p>
                        <p className="text-xs text-muted-foreground">{area.desc}</p>
                      </div>
                      {profile.samui_area === area.id && (
                        <Check className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-6">
          <Button
            onClick={next}
            disabled={!canProceed() || saving}
            className="w-full h-14 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : step === totalSteps - 1 ? (
              <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Let's Go</span>
            ) : (
              <span className="flex items-center gap-2">Continue <ArrowRight className="w-5 h-5" /></span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}