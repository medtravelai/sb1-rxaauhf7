import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { logExercise } from '../../lib/wellness';
import { useAuth } from '../../contexts/AuthContext';

const ACTIVITY_TYPES = [
  { value: 'running', label: 'Correr' },
  { value: 'walking', label: 'Caminar' },
  { value: 'cycling', label: 'Ciclismo' },
  { value: 'swimming', label: 'Natación' },
  { value: 'football', label: 'Fútbol' },
  { value: 'basketball', label: 'Baloncesto' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'other', label: 'Otro' },
];

export function ExerciseForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    activity_type: '',
    duration: 30,
    distance: undefined as number | undefined,
    calories_burned: undefined as number | undefined,
    heart_rate_avg: undefined as number | undefined,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await logExercise({
        ...formData,
        user_id: user.id,
      });
      onSuccess();
      setFormData({
        activity_type: '',
        duration: 30,
        distance: undefined,
        calories_burned: undefined,
        heart_rate_avg: undefined,
        notes: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el ejercicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">Registrar Ejercicio</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Actividad
          </label>
          <select
            required
            className="input mt-1"
            value={formData.activity_type}
            onChange={(e) => setFormData(prev => ({ ...prev, activity_type: e.target.value }))}
          >
            <option value="">Seleccionar actividad</option>
            {ACTIVITY_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            required
            min="1"
            className="input mt-1"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Distancia (km)
          </label>
          <input
            type="number"
            step="0.01"
            className="input mt-1"
            value={formData.distance || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value ? parseFloat(e.target.value) : undefined }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Calorías Quemadas
          </label>
          <input
            type="number"
            className="input mt-1"
            value={formData.calories_burned || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, calories_burned: e.target.value ? parseInt(e.target.value) : undefined }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ritmo Cardíaco Promedio
          </label>
          <input
            type="number"
            className="input mt-1"
            value={formData.heart_rate_avg || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, heart_rate_avg: e.target.value ? parseInt(e.target.value) : undefined }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notas
          </label>
          <textarea
            className="input mt-1"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Guardando...' : 'Registrar Ejercicio'}
        </button>
      </form>
    </div>
  );
}