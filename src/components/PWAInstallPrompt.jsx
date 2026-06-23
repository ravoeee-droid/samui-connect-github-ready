import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('samui-pwa-dismissed') === 'true';
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      if (!dismissed) window.setTimeout(() => setVisible(true), 1500);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  if (!visible || !installEvent) return null;

  const install = async () => {
    installEvent.prompt();
    await installEvent.userChoice;
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem('samui-pwa-dismissed', 'true');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-24 left-1/2 z-[70] w-[min(92vw,430px)] -translate-x-1/2">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-primary/25 bg-background/90 p-3 shadow-[0_22px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,hsl(var(--primary)/.25),transparent_35%)]" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">Install Samui Connect</p>
            <p className="text-xs text-muted-foreground">Fühlt sich wie eine echte App an: schneller Start, Homescreen, PWA-ready.</p>
          </div>
          <button onClick={install} className="rounded-xl bg-primary px-3 py-2 text-xs font-black text-primary-foreground">
            <Download className="mr-1 inline h-3.5 w-3.5" />
            Install
          </button>
          <button onClick={dismiss} className="rounded-xl p-2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
