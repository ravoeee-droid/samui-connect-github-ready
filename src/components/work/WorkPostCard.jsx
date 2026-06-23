import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { samuiVisuals } from '@/lib/visuals';

const typeColors = {
  request: 'bg-accent/20 text-accent border-accent/30',
  offer: 'bg-primary/20 text-primary border-primary/30',
};

const formatLabels = {
  Suche: '🔍 Looking for',
  Biete: '✅ Offering',
  Collab: '🤝 Collab',
  'Empfehlung gesucht': '💡 Rec wanted',
};

export default function WorkPostCard({ post, onContact }) {
  return (
    <div className="group grid grid-cols-[94px_1fr] overflow-hidden rounded-[1.45rem] border border-border/60 bg-card shadow-[0_16px_48px_rgba(0,0,0,.2)] transition-all duration-300 hover:border-primary/25">
      <div className="relative min-h-full overflow-hidden">
        <img src={samuiVisuals.work} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
        {post.is_featured && (
          <div className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-amber-300 text-background shadow-lg">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
        )}
      </div>

      <div className="p-4">
        {post.is_featured && (
          <div className="mb-2 flex items-center gap-1 text-[10px] font-black text-amber-300">
            <Star className="h-3 w-3 fill-current" /> FEATURED
          </div>
        )}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="flex-1 pr-2 font-heading text-sm font-black leading-tight text-foreground">{post.title}</h3>
          <Badge className={`text-[10px] ${typeColors[post.type]} border`}>
            {post.type}
          </Badge>
        </div>

        {post.description && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{post.description}</p>
        )}

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-secondary/80 text-[10px]">
            {post.category}
          </Badge>
          {post.format && (
            <Badge variant="outline" className="border-border/50 text-[10px]">
              {formatLabels[post.format] || post.format}
            </Badge>
          )}
          {post.samui_area && (
            <Badge variant="outline" className="border-border/50 text-[10px]">
              <MapPin className="mr-0.5 h-2.5 w-2.5" />{post.samui_area}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.creator_avatar ? (
              <img src={post.creator_avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-secondary" />
            )}
            <span className="text-xs text-muted-foreground">{post.creator_name || 'Anonymous'}</span>
          </div>
          <button
            onClick={() => onContact?.(post)}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black text-primary transition-colors hover:bg-primary/20"
          >
            Contact <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
