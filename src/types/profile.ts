export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  language: 'es' | 'en';
  notifications_enabled: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  username: string;
  full_name: string;
  avatar_url?: string;
}