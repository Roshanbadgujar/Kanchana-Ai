
export enum KanchanaMode {
  LOVELY = 'Lovely',
  HORROR = 'Horror',
  SHAYARI = 'Shayari',
  CHILL = 'Chill',
  POSSESSIVE = 'Possessive',
  NAUGHTY = 'Naughty',
  MYSTIC = 'Mystic'
}

export enum UserTier {
  FREE = 'Free',
  PREMIUM = 'Premium'
}

export interface Message {
  id: string;
  role: 'user' | 'kanchana';
  text: string;
  timestamp: number;
}

export interface UserPreferences {
  name: string;
  email: string;
  tier: UserTier;
  messageCount: number;
  isAuthenticated: boolean;
}

export type AppView = 'landing' | 'login' | 'register' | 'forgot-password' | 'home' | 'chat' | 'audio' | 'settings' | 'privacy' | 'security' | 'upgrade';
