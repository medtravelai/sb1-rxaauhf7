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
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new AppError('No se encontró el usuario', 'USER_NOT_FOUND');
    }

    // Verify user ID matches
    if (user.id !== exerciseData.user_id) {
      throw new AppError('ID de usuario no válido', 'INVALID_USER');
    }

    // Check if profile exists
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile check error:', profileError);
      throw new AppError('Error al verificar el usuario', 'DATABASE_ERROR', profileError);
    }

    // Create profile if it doesn't exist
    if (!profiles || profiles.length === 0) {
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (createProfileError) {
        console.error('Profile creation error:', createProfileError);
        throw new AppError('Error al crear el perfil', 'DATABASE_ERROR', createProfileError);
      }
    }

    // Log the exercise
    const { data: exerciseLog, error: exerciseError } = await supabase
      .from('exercise_logs')
      .insert({
        ...exerciseData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (exerciseError) {
      console.error('Exercise logging error:', exerciseError);
      throw new AppError('Error al guardar el ejercicio', 'DATABASE_ERROR', exerciseError);
    }

    if (!exerciseLog) {
      throw new AppError('No se pudo registrar el ejercicio', 'INSERT_FAILED');
    }

    return exerciseLog;
  } catch (error) {
    console.error('Error in logExercise:', error);
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
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new AppError('No se encontró el usuario', 'USER_NOT_FOUND');
    }

    // Verify user ID matches
    if (user.id !== mealData.user_id) {
      throw new AppError('ID de usuario no válido', 'INVALID_USER');
    }

    // Check if profile exists
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile check error:', profileError);
      throw new AppError('Error al verificar el usuario', 'DATABASE_ERROR', profileError);
    }

    // Create profile if it doesn't exist
    if (!profiles || profiles.length === 0) {
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (createProfileError) {
        console.error('Profile creation error:', createProfileError);
        throw new AppError('Error al crear el perfil', 'DATABASE_ERROR', createProfileError);
      }
    }

    // Log the meal
    const { data: mealLog, error: mealError } = await supabase
      .from('nutrition_logs')
      .insert({
        ...mealData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (mealError) {
      console.error('Meal logging error:', mealError);
      throw new AppError('Error al guardar la comida', 'DATABASE_ERROR', mealError);
    }

    if (!mealLog) {
      throw new AppError('No se pudo registrar la comida', 'INSERT_FAILED');
    }

    return mealLog;
  } catch (error) {
    console.error('Error in logMeal:', error);
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
