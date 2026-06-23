import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '@/lib/gamification';

export default function DMChat() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = useGame();
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);

  const { data: threads = [] } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => base44.entities.DirectThread.filter({ id: threadId }),
  });
  const thread = threads[0];

  const { data: profiles = [] } = useQuery({
    queryKey: ['my-profile-dm'],
    queryFn: () => base44.entities.Profile.filter({ created_by_id: user?.id }),
    enabled: !!user,
  });
  const myProfile = profiles[0];

  const { data: messages = [] } = useQuery({
    queryKey: ['dm-messages', threadId],
    queryFn: () => base44.entities.DirectMessage.filter({ thread_id: threadId }),
    refetchInterval: 3000,
  });

  useEffect(() => {
    const unsubscribe = base44.entities.DirectMessage.subscribe((event) => {
      if (event.data?.thread_id === threadId) {
        queryClient.invalidateQueries({ queryKey: ['dm-messages', threadId] });
      }
    });
    return unsubscribe;
  }, [threadId, queryClient]);

  const sendMutation = useMutation({
    mutationFn: async (content) => {
      await base44.entities.DirectMessage.create({
        thread_id: threadId,
        sender_id: user?.id,
        sender_name: myProfile?.display_name || 'You',
        sender_avatar: myProfile?.avatar_url || '',
        content,
      });
      await base44.entities.DirectThread.update(threadId, {
        last_message: content,
        last_message_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      game.award('send-message', 20);
      queryClient.invalidateQueries({ queryKey: ['dm-messages', threadId] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const otherName = thread
    ? (thread.participant_a_id === user?.id ? thread.participant_b_name : thread.participant_a_name)
    : 'Chat';

  const otherAvatar = thread
    ? (thread.participant_a_id === user?.id ? thread.participant_b_avatar : thread.participant_a_avatar)
    : '';

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        {otherAvatar ? (
          <img src={otherAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">{otherName?.[0]?.toUpperCase()}</span>
          </div>
        )}
        <div>
          <h1 className="font-semibold text-sm text-foreground">{otherName}</h1>
          <p className="text-[10px] text-muted-foreground">Direct Message</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Say hello! 👋</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === user?.id || msg.created_by_id === user?.id}
          />
        ))}
      </div>

      <div className="pb-safe">
        <ChatInput onSend={(text) => sendMutation.mutate(text)} />
      </div>
    </div>
  );
}