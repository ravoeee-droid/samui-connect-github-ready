import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { MessageCircle, Radio } from 'lucide-react';
import moment from 'moment';
import { samuiVisuals } from '@/lib/visuals';

export default function Messages() {
  const { user } = useAuth();

  const { data: threadsA = [] } = useQuery({
    queryKey: ['threads-a', user?.id],
    queryFn: () => base44.entities.DirectThread.filter({ participant_a_id: user?.id }),
    enabled: !!user,
  });

  const { data: threadsB = [] } = useQuery({
    queryKey: ['threads-b', user?.id],
    queryFn: () => base44.entities.DirectThread.filter({ participant_b_id: user?.id }),
    enabled: !!user,
  });

  const allThreads = [...threadsA, ...threadsB].sort((a, b) =>
    new Date(b.last_message_at || b.created_date) - new Date(a.last_message_at || a.created_date)
  );

  const getOtherPerson = (thread) => {
    if (thread.participant_a_id === user?.id) {
      return { name: thread.participant_b_name, avatar: thread.participant_b_avatar };
    }
    return { name: thread.participant_a_name, avatar: thread.participant_a_avatar };
  };

  return (
    <div className="px-4 pt-5">
      <section className="relative mb-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-card p-4">
        <img src={samuiVisuals.hero} alt="Samui conversations" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary"><Radio className="h-3.5 w-3.5" /> Island inbox</p>
          <h1 className="mt-1 text-2xl font-black font-heading">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your conversations and new connections.</p>
        </div>
      </section>

      <div className="space-y-2">
        {allThreads.map(thread => {
          const other = getOtherPerson(thread);
          return (
            <Link
              key={thread.id}
              to={`/dm/${thread.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-3 shadow-[0_14px_42px_rgba(0,0,0,.16)] transition-all hover:border-primary/25"
            >
              {other.avatar ? (
                <img src={other.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">{other.name?.[0]?.toUpperCase() || '?'}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-sm">{other.name || 'Unknown'}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {thread.last_message_at ? moment(thread.last_message_at).fromNow() : ''}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {thread.last_message || 'No messages yet'}
                </p>
              </div>
            </Link>
          );
        })}

        {allThreads.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No conversations yet</p>
            <p className="text-muted-foreground text-xs mt-1">Find people in Explore to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}