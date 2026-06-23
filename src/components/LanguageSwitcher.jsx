import React, { useState } from 'react';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

export default function LanguageSwitcher({ compact = false, className }) {
  const [open, setOpen] = useState(false);
  const { currentLanguage, languages, language, setLanguage, t } = useLanguage();

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex items-center gap-2 rounded-full border border-white/10 bg-card/85 px-3 py-2 text-xs font-black text-foreground shadow-[0_12px_40px_rgba(0,0,0,.24)] backdrop-blur-2xl transition-all hover:border-primary/40',
          compact && 'px-2.5 py-1.5'
        )}
      >
        <Globe2 className="h-4 w-4 text-primary" />
        <span>{currentLanguage.flag}</span>
        {!compact && <span>{currentLanguage.native}</span>}
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[70] w-56 overflow-hidden rounded-2xl border border-white/10 bg-card/95 p-2 shadow-[0_22px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
          <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">{t('language.short')}</p>
          <div className="space-y-1">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors',
                  language === item.code ? 'bg-primary/15 text-foreground' : 'hover:bg-secondary'
                )}
              >
                <span className="text-lg">{item.flag}</span>
                <span className="flex-1">{item.native}</span>
                {language === item.code && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
