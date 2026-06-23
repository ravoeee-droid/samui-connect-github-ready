import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'samui-connect-game-v2';

export const LEVELS = [
  { level: 1, title: 'Island Rookie', minXp: 0, nextXp: 120, perk: 'Profile boost unlocked soon', badge: '🌴' },
  { level: 2, title: 'Beach Connector', minXp: 120, nextXp: 300, perk: '+1 featured room boost', badge: '🤝' },
  { level: 3, title: 'Samui Insider', minXp: 300, nextXp: 600, perk: 'Priority in Explore', badge: '🧭' },
  { level: 4, title: 'Social Captain', minXp: 600, nextXp: 1000, perk: 'Host badge unlocked', badge: '🎤' },
  { level: 5, title: 'Island Legend', minXp: 1000, nextXp: 1500, perk: 'VIP creator status', badge: '👑' },
  { level: 6, title: 'Local Icon', minXp: 1500, nextXp: 2300, perk: 'Leaderboard glow', badge: '💎' },
  { level: 7, title: 'Samui Kingpin', minXp: 2300, nextXp: 3500, perk: 'Premium island status', badge: '🔥' },
];

export const DAILY_ACTIONS = [
  { id: 'daily-checkin', label: 'Daily island check-in', xp: 25, emoji: '🌴', type: 'daily' },
  { id: 'join-room', label: 'Join a live room', xp: 15, emoji: '💬', type: 'social' },
  { id: 'send-message', label: 'Send your first message', xp: 20, emoji: '⚡', type: 'social' },
  { id: 'dm-person', label: 'Start a new connection', xp: 30, emoji: '🤝', type: 'social' },
  { id: 'post-event', label: 'Post or join an event', xp: 40, emoji: '🎉', type: 'event' },
  { id: 'share-invite', label: 'Share an invite link', xp: 35, emoji: '📲', type: 'viral' },
  { id: 'rental-request', label: 'Send a rental request', xp: 35, emoji: '🛵', type: 'marketplace' },
];

export const ACHIEVEMENTS = [
  { id: 'first-checkin', title: 'First Check-in', emoji: '🌅', description: 'Start your island streak', requiresXp: 25 },
  { id: 'connector-100', title: '100 XP Connector', emoji: '⚡', description: 'Collect your first 100 XP', requiresXp: 100 },
  { id: 'social-300', title: 'Social Explorer', emoji: '🧭', description: 'Reach 300 XP', requiresXp: 300 },
  { id: 'captain-600', title: 'Host Material', emoji: '🎤', description: 'Reach 600 XP', requiresXp: 600 },
  { id: 'rental-scout', title: 'Rental Scout', emoji: '🛵', description: 'Try the island marketplace', requiresXp: 180 },
  { id: 'legend-1000', title: 'Island Legend', emoji: '👑', description: 'Reach 1000 XP', requiresXp: 1000 },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultState = {
  xp: 90,
  streak: 1,
  lastCheckIn: null,
  completed: {},
  history: [],
  unlockedBadges: ['first-checkin'],
};

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const getLevel = (xp) => {
  const current = [...LEVELS].reverse().find((lvl) => xp >= lvl.minXp) || LEVELS[0];
  const nextXp = current.nextXp || current.minXp + 500;
  const progress = Math.min(100, Math.round(((xp - current.minXp) / (nextXp - current.minXp)) * 100));
  return { ...current, nextXp, progress };
};

const emitGameEvent = (eventName, detail) => {
  if (typeof window === 'undefined') return;
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    window.dispatchEvent(new CustomEvent('samui-game-updated', { detail }));
  });
};

const nextStreak = (previousLastCheckIn) => {
  const today = todayKey();
  if (previousLastCheckIn === today) return null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  return previousLastCheckIn === yesterdayKey ? 'increment' : 'reset';
};

const useGameStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      award: (actionId, xp, options = {}) => {
        const today = todayKey();
        const key = options.once === false ? `${actionId}-${Date.now()}` : `${actionId}-${today}`;
        const action = DAILY_ACTIONS.find((item) => item.id === actionId);
        let emitted = null;

        set((prev) => {
          if (options.once !== false && prev.completed?.[key]) return prev;

          const oldLevel = getLevel(prev.xp);
          const nextXpTotal = prev.xp + xp;
          const newLevel = getLevel(nextXpTotal);
          const newlyUnlocked = ACHIEVEMENTS
            .filter((badge) => nextXpTotal >= badge.requiresXp && !prev.unlockedBadges?.includes(badge.id))
            .map((badge) => badge.id);

          const next = {
            ...prev,
            xp: nextXpTotal,
            completed: { ...prev.completed, [key]: true },
            unlockedBadges: [...new Set([...(prev.unlockedBadges || []), ...newlyUnlocked])],
            history: [
              {
                actionId,
                label: action?.label || options.label || 'XP earned',
                emoji: action?.emoji || options.emoji || '⚡',
                xp,
                date: new Date().toISOString(),
              },
              ...(prev.history || []),
            ].slice(0, 30),
          };

          if (actionId === 'daily-checkin' && prev.lastCheckIn !== today) {
            const streakMode = nextStreak(prev.lastCheckIn);
            next.streak = streakMode === 'increment' ? (prev.streak || 0) + 1 : 1;
            next.lastCheckIn = today;
          }

          emitted = {
            ...next,
            gainedXp: xp,
            actionId,
            label: action?.label || options.label || 'XP earned',
            emoji: action?.emoji || options.emoji || '⚡',
            leveledUp: newLevel.level > oldLevel.level,
            oldLevel,
            newLevel,
            newlyUnlocked,
          };

          return next;
        });

        if (emitted) emitGameEvent('samui-xp-earned', emitted);
      },

      resetGame: () => set(defaultState),

      hasCompletedToday: (actionId) => Boolean(get().completed?.[`${actionId}-${todayKey()}`]),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : noopStorage)),
      partialize: (state) => ({
        xp: state.xp,
        streak: state.streak,
        lastCheckIn: state.lastCheckIn,
        completed: state.completed,
        history: state.history,
        unlockedBadges: state.unlockedBadges,
      }),
    }
  )
);

export function useGame() {
  const state = useGameStore();
  const level = useMemo(() => getLevel(state.xp), [state.xp]);
  const completedToday = useMemo(() => {
    const today = todayKey();
    return DAILY_ACTIONS.reduce((acc, action) => {
      acc[action.id] = Boolean(state.completed?.[`${action.id}-${today}`]);
      return acc;
    }, {});
  }, [state.completed]);

  const badges = useMemo(() => ACHIEVEMENTS.map((badge) => ({
    ...badge,
    unlocked: state.unlockedBadges?.includes(badge.id) || state.xp >= badge.requiresXp,
  })), [state.unlockedBadges, state.xp]);

  return {
    ...state,
    isReady: true,
    level,
    completedToday,
    badges,
    award: state.award,
    resetGame: state.resetGame,
    checkIn: () => state.award('daily-checkin', 25),
  };
}

export const useGameSnapshot = () => useGameStore.getState();
