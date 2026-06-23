import React from 'react';
import { cn } from '@/lib/utils';

export default function OnboardingProgress({ current, total }) {
  return (
    <div className="flex gap-1.5 px-6 pt-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 rounded-full flex-1 transition-all duration-500",
            i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-border"
          )}
        />
      ))}
    </div>
  );
}