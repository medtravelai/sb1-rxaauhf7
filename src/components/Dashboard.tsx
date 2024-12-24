import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getExerciseLogs, getNutritionLogs, getWellnessLogs } from '../lib/api';
import { Activity, Utensils, Heart, AlertCircle } from 'lucide-react';
import { Database } from '../types/database.types';
import { formatDate, isWithinWeek } from '../utils/dateUtils';
import { getErrorMessage } from '../utils/errorUtils';

type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row'];
type NutritionLog = Database['public']['Tables']['nutrition_logs']['Row'];
type WellnessLog = Database['public']['Tables']['wellness_logs']['Row'];

interface DashboardData {
  recentExercises: ExerciseLog[];
  recentMeals: NutritionLog[];
  recentWellness: WellnessLog[];
  loading: boolean;
  error: string | null;
}

interface WeeklySummary {
  totalExerciseMinutes: number;
  averageCalories: number;
  averageSleep: number;
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    recentExercises: [],
    recentMeals: [],
    recentWellness: [],
    loading: true,
    error: null
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('No user found');

      const [exercises, meals, wellness] = await Promise.all([
        getExerciseLogs(user.id),
        getNutritionLogs(user.id),
        getWellnessLogs(user.id)
      ]);

      setData({
        recentExercises: exercises.slice(0, 5),
        recentMeals: meals.slice(0, 5),
        recentWellness: wellness.slice(0, 5),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setData(prev => ({ 
        ...prev, 
        loading: false,
        error: getErrorMessage(error)
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const weeklySummary = useMemo<WeeklySummary>(() => {
    const weeklyExercises = data.recentExercises.filter(ex => isWithinWeek(ex.created_at));
    const weeklyMeals = data.recentMeals.filter(meal => isWithinWeek(meal.created_at));
    const weeklyWellness = data.recentWellness.filter(
      log => isWithinWeek(log.created_at) && log.sleep_hours !== null
    );

    return {
      totalExerciseMinutes: weeklyExercises.reduce((acc, curr) => acc + curr.duration, 0),
      averageCalories: weeklyMeals.length > 0
        ? Math.round(weeklyMeals.reduce((acc, curr) => acc + (curr.total_calories || 0), 0) / weeklyMeals.length)
        : 0,
      averageSleep: weeklyWellness.length > 0
        ? Number((weeklyWellness.reduce((acc, curr) => acc + (curr.sleep_hours || 0), 0) / weeklyWellness.length).toFixed(1))
        : 0
    };
  }, [data.recentExercises, data.recentMeals, data.recentWellness]);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p>{data.error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Ejercicios Recientes</h2>
          </div>
          {data.recentExercises.length > 0 ? (
            <ul className="space-y-3">
              {data.recentExercises.map((exercise) => (
                <li key={exercise.id} className="flex justify-between items-center p-2 hover:bg-orange-50 rounded-lg transition-colors">
                  <div>
                    <span className="font-medium">{exercise.activity_type}</span>
                    {exercise.distance && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({exercise.distance.toFixed(1)} km)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-600">{exercise.duration} min</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(exercise.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay ejercicios registrados</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Comidas Recientes</h2>
          </div>
          {data.recentMeals.length > 0 ? (
            <ul className="space-y-3">
              {data.recentMeals.map((meal) => (
                <li key={meal.id} className="flex justify-between items-center p-2 hover:bg-orange-50 rounded-lg transition-colors">
                  <div>
                    <span className="font-medium capitalize">{meal.meal_type}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Object.keys(meal.food_items).length} items)
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-600">{meal.total_calories} cal</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(meal.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay comidas registradas</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Bienestar Reciente</h2>
          </div>
          {data.recentWellness.length > 0 ? (
            <ul className="space-y-3">
              {data.recentWellness.map((log) => (
                <li key={log.id} className="flex justify-between items-center p-2 hover:bg-orange-50 rounded-lg transition-colors">
                  <div>
                    <span className="font-medium capitalize">{log.mood}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      (Energía: {log.energy_level}/10)
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-600">
                      {log.sleep_hours ? `${log.sleep_hours}h sueño` : 'Sin datos'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay registros de bienestar</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Resumen Semanal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Total Ejercicio</h3>
            <p className="text-2xl font-bold text-orange-500">
              {weeklySummary.totalExerciseMinutes} min
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Promedio Calorías</h3>
            <p className="text-2xl font-bold text-orange-500">
              {weeklySummary.averageCalories} cal
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Promedio Sueño</h3>
            <p className="text-2xl font-bold text-orange-500">
              {weeklySummary.averageSleep}h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
