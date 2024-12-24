import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Activity, Clock, Route, Flame, Heart } from 'lucide-react';
import type { Exercise } from '../../types/wellness';

interface ExerciseListProps {
  exercises: Exercise[];
}

const ACTIVITY_LABELS: Record<string, string> = {
  running: 'Correr',
  walking: 'Caminar',
  cycling: 'Ciclismo',
  swimming: 'Natación',
  football: 'Fútbol',
  basketball: 'Baloncesto',
  yoga: 'Yoga',
  other: 'Otro',
};

export function ExerciseList({ exercises }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay ejercicios registrados aún
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {ACTIVITY_LABELS[exercise.activity_type] || exercise.activity_type}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(exercise.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {exercise.duration} minutos
              </span>
            </div>

            {exercise.distance && (
              <div className="flex items-center gap-2">
                <Route className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {exercise.distance} km
                </span>
              </div>
            )}

            {exercise.calories_burned && (
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {exercise.calories_burned} kcal
                </span>
              </div>
            )}

            {exercise.heart_rate_avg && (
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {exercise.heart_rate_avg} bpm
                </span>
              </div>
            )}
          </div>

          {exercise.notes && (
            <p className="mt-3 text-sm text-gray-600 border-t pt-3">
              {exercise.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}