import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPreferences, updatePreferences } from '../../lib/profile';
import type { UserPreferences } from '../../types/profile';
import { Settings } from 'lucide-react';

export function PreferencesForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    language: 'es',
    notifications_enabled: true,
    theme: 'light',
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  async function loadPreferences() {
    try {
      const userPrefs = await getPreferences(user!.id);
      setPreferences(userPrefs);
    } catch (err) {
      setError('Error al cargar las preferencias');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updatePreferences(user.id, {
        language: preferences.language,
        notifications_enabled: preferences.notifications_enabled,
        theme: preferences.theme,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar las preferencias');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="text-center mb-6">
        <Settings className="w-12 h-12 text-orange-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Preferencias</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
          Preferencias actualizadas con éxito
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Idioma
          </label>
          <select
            className="input mt-1"
            value={preferences.language}
            onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value as 'es' | 'en' }))}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="notifications"
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            checked={preferences.notifications_enabled}
            onChange={(e) => setPreferences(prev => ({ ...prev, notifications_enabled: e.target.checked }))}
          />
          <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
            Activar notificaciones
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tema
          </label>
          <select
            className="input mt-1"
            value={preferences.theme}
            onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' }))}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Guardando...' : 'Guardar Preferencias'}
        </button>
      </form>
    </div>
  );
}