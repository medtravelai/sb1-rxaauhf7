import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../lib/profile';
import type { ProfileFormData } from '../../types/profile';
import { User } from 'lucide-react';

export function ProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    full_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    try {
      const profile = await getProfile(user!.id);
      setFormData(profile);
    } catch (err) {
      setError('Error al cargar el perfil');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateProfile(user.id, formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-orange-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Tu Perfil</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
          Perfil actualizado con éxito
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nombre de Usuario
          </label>
          <input
            id="username"
            type="text"
            required
            className="input mt-1"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input
            id="fullName"
            type="text"
            required
            className="input mt-1"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
            URL del Avatar (opcional)
          </label>
          <input
            id="avatarUrl"
            type="url"
            className="input mt-1"
            value={formData.avatar_url || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}