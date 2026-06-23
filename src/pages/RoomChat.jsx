import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import { ArrowLeft, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useGame } from '@/lib/gamification';
import { visualByCategory } from '@/lib/visuals';

export default function RoomChat() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = useGame();
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);

  const { data: rooms = [] } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => base44.entities.Room.filter({ id: roomId }),
  });
  const room = rooms[0];

  const { data: profiles = [] } = useQuery({
    queryKey: ['my-profile-chat'],
    queryFn: () => base44.entities.Profile.filter({ created_by_id: user?.id }),
    enabled: !!user,
  });
  const myProfile = profiles[0];

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => base44.entities.Message.filter({ room_id: roomId }),
    refetchInterval: 3000,
  });

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.Message.subscribe((event) => {
      if (event.data?.room_id === roomId) {
        queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
      }
    });
    return unsubscribe;
  }, [roomId, queryClient]);

  const sendMutation = useMutation({
    mutationFn: (content) => base44.entities.Message.create({
      room_id: roomId,
      content,
      sender_name: myProfile?.display_name || 'Anonymous',
      sender_avatar: myProfile?.avatar_url || '',
    }),
    onSuccess: () => {
      game.award('send-message', 20);
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleReport = async (message) => {
    await base44.entities.Report.create({
      reporter_id: user?.id,
      target_message_id: message.id,
      target_user_id: message.created_by_id,
      reason: 'inappropriate',
    });
    toast.success('Message reported');
  };

  const handleBlock = async (message) => {
    await base44.entities.Block.create({
      blocked_user_id: message.created_by_id,
    });
    toast.success('User blocked');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="relative flex items-center gap-3 overflow-hidden px-4 py-3 bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-10">
        <img src={visualByCategory(room?.subcategory)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-card/75" />
        <button onClick={() => navigate(-1)} className="relative p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="relative flex-1">
          <h1 className="font-semibold text-foreground">{room?.name || 'Chat'}</h1>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
            <span>{room?.online_count || Math.floor(Math.random() * 15 + 5)} online</span>
          </div>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Users className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-muted-foreground text-sm">No messages yet</p>
            <p className="text-muted-foreground text-xs mt-1">Be the first to say hi!</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isOwn={msg.created_by_id === user?.id}
            onReport={handleReport}
            onBlock={handleBlock}
          />
        ))}
      </div>

      {/* Input */}
      <div className="pb-safe">
        <ChatInput onSend={(text) => sendMutation.mutate(text)} />
      </div>
    </div>
  );
}