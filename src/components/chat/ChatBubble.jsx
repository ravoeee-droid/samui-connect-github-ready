import React from 'react';
import { cn } from '@/lib/utils';
import { Ban, CheckCheck, Flag, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import moment from 'moment';

export default function ChatBubble({ message, isOwn, onReport, onBlock }) {
  return (
    <div className={cn('flex gap-2.5 group', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {!isOwn && (
        <div className="mt-1 flex-shrink-0">
          {message.sender_avatar ? (
            <img src={message.sender_avatar} alt="" className="h-9 w-9 rounded-2xl object-cover ring-1 ring-primary/20" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-secondary ring-1 ring-white/10">
              <span className="text-xs font-black text-muted-foreground">
                {message.sender_name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={cn('max-w-[78%]', isOwn && 'items-end')}>
        {!isOwn && (
          <p className="mb-1 ml-1 text-[10px] font-black uppercase tracking-[0.11em] text-muted-foreground">
            {message.sender_name || 'Anonymous'}
          </p>
        )}
        <div className="flex items-end gap-1.5">
          <div
            className={cn(
              'relative overflow-hidden rounded-[1.15rem] px-3.5 py-2.5 text-sm leading-relaxed shadow-[0_12px_32px_rgba(0,0,0,.18)]',
              isOwn
                ? 'rounded-br-md bg-gradient-to-br from-primary to-cyan-300 text-primary-foreground'
                : 'rounded-bl-md border border-white/10 bg-secondary text-foreground'
            )}
          >
            {isOwn && <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.24),transparent_40%)]" />}
            <span className="relative">{message.content}</span>
          </div>

          {!isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger className="opacity-0 transition-opacity group-hover:opacity-100">
                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="border-border bg-card">
                <DropdownMenuItem onClick={() => onReport?.(message)} className="text-xs">
                  <Flag className="mr-2 h-3 w-3" /> Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBlock?.(message)} className="text-xs text-destructive">
                  <Ban className="mr-2 h-3 w-3" /> Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className={cn('mt-1 flex items-center gap-1 text-[10px] text-muted-foreground', isOwn ? 'justify-end mr-1' : 'ml-1')}>
          {moment(message.created_date).fromNow()}
          {isOwn && <CheckCheck className="h-3 w-3 text-primary" />}
        </p>
      </div>
    </div>
  );
}
