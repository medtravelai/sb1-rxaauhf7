export interface Exercise {
  id: string;
  user_id: string;
  activity_type: string;
  duration: number;
  distance?: number;
  calories_burned?: number;
  heart_rate_avg?: number;
  notes?: string;
  gps_data?: any;
  created_at: string;
  updated_at: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  meal_type: string;
  food_name: string;
  portion_size?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WellnessLog {
  id: string;
  user_id: string;
  mood_rating?: number;
  mood_notes?: string;
  sleep_hours?: number;
  sleep_quality?: number;
  stress_level?: number;
  siesta_duration?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  difficulty_level: string;
  duration_weeks?: number;
  exercises: any;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: any[];
  instructions: any[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  calories_per_serving?: number;
  image_url?: string;
  region?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}