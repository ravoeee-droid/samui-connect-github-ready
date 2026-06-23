import React, { useState } from 'react';
import { Bell, BellRing, ShieldCheck } from 'lucide-react';

export default function PushPrompt({ compact = false }) {
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return setPermission('unsupported');
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  if (permission === 'granted') {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
        <BellRing className="mr-1.5 inline h-3.5 w-3.5" />
        Push ready
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      className={compact
        ? 'rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-black text-primary'
        : 'w-full rounded-[1.35rem] border border-primary/20 bg-card p-4 text-left shadow-[0_18px_55px_rgba(0,0,0,.18)]'}
    >
      {compact ? (
        <>
          <Bell className="mr-1.5 inline h-3.5 w-3.5" />
          Enable Push
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black">Turn on island alerts</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              For live events, room activity and direct messages. Backend push wiring is ready as next production step.
            </p>
          </div>
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
      )}
    </button>
  );
}
