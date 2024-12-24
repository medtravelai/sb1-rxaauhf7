import { supabase } from './supabase';
import { Database } from '../types/database.types';
import { AppError } from '../utils/errorUtils';

type Tables = Database['public']['Tables'];

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('network')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Profile
export async function getProfile(userId: string) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) throw new AppError('Profile not found', 'NOT_FOUND');
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateProfile(userId: string, updates: Partial<Tables['profiles']['Update']>) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) throw new AppError('Profile not found', 'NOT_FOUND');
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Exercise
export async function logExercise(exerciseData: Omit<Tables['exercise_logs']['Insert'], 'id' | 'created_at'>) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('exercise_logs')
        .insert(exerciseData)
        .select()
        .single()
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) throw new AppError('Failed to log exercise', 'INSERT_FAILED');
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getExerciseLogs(userId: string) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('exercise_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) return [];
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Nutrition
export async function logMeal(mealData: Omit<Tables['nutrition_logs']['Insert'], 'id' | 'created_at'>) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('nutrition_logs')
        .insert(mealData)
        .select()
        .single()
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) throw new AppError('Failed to log meal', 'INSERT_FAILED');
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getNutritionLogs(userId: string) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) return [];
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Wellness
export async function logWellness(wellnessData: Omit<Tables['wellness_logs']['Insert'], 'id' | 'created_at'>) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('wellness_logs')
        .insert(wellnessData)
        .select()
        .single()
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) throw new AppError('Failed to log wellness data', 'INSERT_FAILED');
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getWellnessLogs(userId: string) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('wellness_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) return [];
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Workout Plans
export async function createWorkoutPlan(planData: Omit<Tables['workout_plans']['Insert'], 'id' | 'created_at'>) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('workout_plans')
        .insert(planData)
        .select()
        .single()
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) throw new AppError('Failed to create workout plan', 'INSERT_FAILED');
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getWorkoutPlans(userId: string) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) return [];
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Meal Plans
export async function createMealPlan(planData: Omit<Tables['meal_plans']['Insert'], 'id' | 'created_at'>) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('meal_plans')
        .insert(planData)
        .select()
        .single()
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) throw new AppError('Failed to create meal plan', 'INSERT_FAILED');
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getMealPlans(userId: string) {
  try {
    const { data, error } = await withRetry(() =>
      supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );
  
    if (error) throw new AppError(error.message, 'DATABASE_ERROR', error);
    if (!data) return [];
    
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

function handleApiError(error: unknown): never {
  if (error instanceof AppError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new AppError(error.message, 'API_ERROR', error);
  }

  throw new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
}
