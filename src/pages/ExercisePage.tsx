import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getExercises } from '../lib/wellness';
import { ExerciseForm } from '../components/exercise/ExerciseForm';
import { ExerciseList } from '../components/exercise/ExerciseList';
import type { Exercise } from '../types/wellness';

export function ExercisePage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExercises = async () => {
    if (!user) return;
    
    try {
      const data = await getExercises(user.id);
      setExercises(data);
    } catch (err) {
      setError('Error al cargar los ejercicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ExerciseForm onSuccess={loadExercises} />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Historial de Ejercicios
          </h2>
          {error ? (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          ) : (
            <ExerciseList exercises={exercises} />
          )}
        </div>
      </div>
    </div>
  );
}