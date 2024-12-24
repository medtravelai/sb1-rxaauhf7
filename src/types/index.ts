export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Exercise {
  id: string;
  userId: string;
  type: string;
  duration: number;
  intensity: 'bajo' | 'medio' | 'alto';
  date: string;
  notes?: string;
}

export interface Nutrition {
  id: string;
  userId: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  notes?: string;
}

export interface Mood {
  id: string;
  userId: string;
  level: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  date: string;
}

export interface Sleep {
  id: string;
  userId: string;
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  date: string;
  notes?: string;
}