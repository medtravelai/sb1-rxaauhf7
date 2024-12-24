import { supabase } from './supabase';
import type { Exercise, NutritionLog, WellnessLog, WorkoutPlan, Recipe } from '../types/wellness';

// Exercise functions
export async function logExercise(exerciseData: Omit<Exercise, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('exercises')
    .insert([{ ...exerciseData }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExercises(userId: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Nutrition functions
export async function logNutrition(nutritionData: Omit<NutritionLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert([{ ...nutritionData }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getNutritionLogs(userId: string) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Wellness functions
export async function logWellness(wellnessData: Omit<WellnessLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('wellness_logs')
    .insert([{ ...wellnessData }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWellnessLogs(userId: string) {
  const { data, error } = await supabase
    .from('wellness_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Workout plan functions
export async function createWorkoutPlan(planData: Omit<WorkoutPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('workout_plans')
    .insert([{ ...planData }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWorkoutPlans(userId: string) {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Recipe functions
export async function getRecipes(region?: string, tags?: string[]) {
  let query = supabase.from('recipes').select('*');
  
  if (region) {
    query = query.eq('region', region);
  }
  
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRecipeById(id: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}