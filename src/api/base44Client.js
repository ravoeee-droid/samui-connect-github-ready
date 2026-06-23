import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const isDemoMode = !appId || import.meta.env.VITE_FORCE_DEMO === 'true';

const now = () => new Date().toISOString();
const uid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;

const demoUser = {
  id: 'demo-user',
  email: 'demo@samui-connect.app',
  full_name: 'Demo User',
  name: 'Demo User',
};

const seed = {
  Room: [
    { id: 'snorkeling', name: 'Snorkeling Crew', subcategory: 'activities', is_active: true, online_count: 18, description: 'Find people for Coral Cove, Silver Beach and boat trips.', emoji: '🤿' },
    { id: 'party', name: 'Chaweng Tonight', subcategory: 'nightlife', is_active: true, online_count: 32, description: 'Bars, beach clubs and people going out tonight.', emoji: '🎉' },
    { id: 'coworking', name: 'Nomad Coffee', subcategory: 'coworking', is_active: true, online_count: 11, description: 'Coworking, cafes, founders and laptop sessions.', emoji: '💻' },
    { id: 'b2b', name: 'Work Connect', subcategory: 'b2b', is_active: true, online_count: 9, description: 'Find creators, web people, hosts and local collabs.', emoji: '🤝' },
  ],
  Event: [
    { id: 'event_1', title: 'Sunset Beach Meetup', location: 'Fisherman’s Village', category: 'nightlife', created_date: now(), time: '19:00', creator_name: 'Maya', creator_avatar: '', attendees_count: 14, description: 'Casual beach meetup with cocktails and new people.' },
    { id: 'event_2', title: 'Silver Beach Snorkeling', location: 'Silver Beach', category: 'activities', created_date: now(), time: '10:30', creator_name: 'Leo', creator_avatar: '', attendees_count: 7, description: 'Bring a mask, we split taxis and meet at the beach.' },
  ],
  Profile: [
    { id: 'profile_demo', created_by_id: 'demo-user', display_name: 'Raphael', avatar_url: '', onboarding_complete: true, languages: ['de', 'en'], interests: ['snorkeling', 'party', 'coworking', 'website'], samui_area: 'Chaweng', status: 'online', bio: 'Building Samui Connect and meeting island people.' },
    { id: 'profile_maya', created_by_id: 'maya-user', display_name: 'Maya', avatar_url: '', onboarding_complete: true, languages: ['en', 'th'], interests: ['party', 'bars'], samui_area: 'Bophut', status: 'tonight', bio: 'Beach clubs, events and sunset meetups.' },
    { id: 'profile_leo', created_by_id: 'leo-user', display_name: 'Leo', avatar_url: '', onboarding_complete: true, languages: ['de', 'en'], interests: ['snorkeling', 'pool'], samui_area: 'Lamai', status: 'today', bio: 'Always down for water and exploring.' },
    { id: 'profile_nina', created_by_id: 'nina-user', display_name: 'Nina', avatar_url: '', onboarding_complete: true, languages: ['en', 'fr'], interests: ['coworking', 'designer', 'social-media'], samui_area: 'Maenam', status: 'online', bio: 'Digital nomad, design, coffee and coworking.' },
  ],
  Message: [
    { id: 'msg_1', room_id: 'snorkeling', created_by_id: 'leo-user', sender_name: 'Leo', sender_avatar: '', content: 'Anyone up for Silver Beach tomorrow morning?', created_date: now() },
    { id: 'msg_2', room_id: 'party', created_by_id: 'maya-user', sender_name: 'Maya', sender_avatar: '', content: 'Chaweng beach club tonight? We are 4 people already 🌴', created_date: now() },
  ],
  WorkPost: [
    { id: 'work_1', title: 'Need reel creator for villa shoot', category: 'offer', budget: '3,000–6,000 THB', location: 'Bophut', created_date: now(), creator_id: 'maya-user', creator_name: 'Maya', creator_avatar: '', description: 'Looking for someone who can shoot a short premium reel this week.' },
    { id: 'work_2', title: 'Website / funnel people on Samui', category: 'request', budget: 'Project based', location: 'Remote / Chaweng', created_date: now(), creator_id: 'demo-user', creator_name: 'Raphael', creator_avatar: '', description: 'Building local projects and looking for strong collabs.' },
  ],
  DirectThread: [],
  DirectMessage: [],
  Report: [],
  Block: [],
};

const readDb = () => {
  if (typeof window === 'undefined') return structuredClone(seed);
  try {
    const saved = window.localStorage.getItem('samui-demo-db-v3');
    if (saved) return JSON.parse(saved);
  } catch {}
  const cloned = JSON.parse(JSON.stringify(seed));
  window.localStorage.setItem('samui-demo-db-v3', JSON.stringify(cloned));
  return cloned;
};

const writeDb = (db) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('samui-demo-db-v3', JSON.stringify(db));
  }
};

const matches = (item, filters = {}) => Object.entries(filters || {}).every(([key, value]) => item?.[key] === value);

const makeEntity = (name) => ({
  async filter(filters = {}) {
    const db = readDb();
    return (db[name] || []).filter((item) => matches(item, filters));
  },
  async list(sort = '-created_date', limit = 50) {
    const db = readDb();
    const arr = [...(db[name] || [])];
    const key = String(sort || '').replace('-', '');
    const desc = String(sort || '').startsWith('-');
    arr.sort((a, b) => {
      const av = a?.[key] || '';
      const bv = b?.[key] || '';
      return desc ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
    return arr.slice(0, limit || arr.length);
  },
  async create(data = {}) {
    const db = readDb();
    const item = {
      id: data.id || uid(name.toLowerCase()),
      created_date: data.created_date || now(),
      created_by_id: data.created_by_id || demoUser.id,
      ...data,
    };
    db[name] = [item, ...(db[name] || [])];
    writeDb(db);
    return item;
  },
  async update(id, data = {}) {
    const db = readDb();
    db[name] = (db[name] || []).map((item) => item.id === id ? { ...item, ...data, updated_date: now() } : item);
    writeDb(db);
    return (db[name] || []).find((item) => item.id === id) || null;
  },
  subscribe() {
    return () => {};
  },
});

const demoBase44 = {
  auth: {
    async isAuthenticated() { return true; },
    async me() { return demoUser; },
    async loginViaEmailPassword() { return { access_token: 'demo-token' }; },
    loginWithProvider() { window.location.href = '/'; },
    async register() { return { ok: true }; },
    async verifyOtp() { return { access_token: 'demo-token' }; },
    setToken() {},
    async resendOtp() { return { ok: true }; },
    async resetPasswordRequest() { return { ok: true }; },
    async resetPassword() { return { ok: true }; },
    logout(redirect = '/') { window.location.href = typeof redirect === 'string' ? redirect : '/welcome'; },
    redirectToLogin() { window.location.href = '/welcome'; },
  },
  entities: {
    Room: makeEntity('Room'),
    Event: makeEntity('Event'),
    Profile: makeEntity('Profile'),
    Message: makeEntity('Message'),
    WorkPost: makeEntity('WorkPost'),
    DirectThread: makeEntity('DirectThread'),
    DirectMessage: makeEntity('DirectMessage'),
    Report: makeEntity('Report'),
    Block: makeEntity('Block'),
  },
};

export const base44 = isDemoMode
  ? demoBase44
  : createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl,
    });
