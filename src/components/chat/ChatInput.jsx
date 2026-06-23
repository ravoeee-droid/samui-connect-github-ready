import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const QUICK_REPLIES = ['I’m in 🌴', 'Where exactly?', 'Anyone joining?', 'See you there'];

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSend = (value = text) => {
    const clean = value.trim();
    if (!clean || disabled) return;
    navigator.vibrate?.(25);
    onSend(clean);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/10 bg-card/95 p-3 backdrop-blur-2xl">
      <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            disabled={disabled}
            className="whitespace-nowrap rounded-full border border-white/10 bg-background/50 px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition hover:border-primary/35 hover:text-primary"
          >
            {reply}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... +20 XP"
            disabled={disabled}
            className="h-12 w-full rounded-2xl border border-white/10 bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <button
          onClick={() => handleSend()}
          disabled={!text.trim() || disabled}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.3)] transition-all duration-200 hover:scale-[1.03] disabled:scale-100 disabled:opacity-30"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
