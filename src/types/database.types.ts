export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercise_logs: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          duration: number
          distance: number | null
          calories: number | null
          gps_data: Json | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          duration: number
          distance?: number | null
          calories?: number | null
          gps_data?: Json | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          duration?: number
          distance?: number | null
          calories?: number | null
          gps_data?: Json | null
          notes?: string | null
          created_at?: string
        }
      }
      nutrition_logs: {
        Row: {
          id: string
          user_id: string
          meal_type: string
          food_items: Json
          total_calories: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type: string
          food_items: Json
          total_calories?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_type?: string
          food_items?: Json
          total_calories?: number | null
          created_at?: string
        }
      }
      wellness_logs: {
        Row: {
          id: string
          user_id: string
          mood: string
          energy_level: number
          sleep_hours: number | null
          sleep_quality: number | null
          stress_level: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: string
          energy_level: number
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: string
          energy_level?: number
          sleep_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          difficulty: string
          exercises: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          difficulty: string
          exercises: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          difficulty?: string
          exercises?: Json
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          meals: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          meals: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          meals?: Json
          created_at?: string
        }
      }
    }
  }
}
