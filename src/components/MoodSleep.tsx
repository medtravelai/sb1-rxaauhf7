import React, { useState, useEffect, useMemo } from 'react';
import { Smile, Moon, Brain, FileText, Watch, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getWellnessLogs } from '../lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MOOD_OPTIONS, RANGES } from '../constants/wellness';
import { useWellnessForm } from '../hooks/useWellnessForm';
import { calculateWellnessStats } from '../utils/wellnessUtils';
import { Database } from '../types/database.types';

type WellnessLog = Database['public']['Tables']['wellness_logs']['Row'];

export const MoodSleep: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mood');
  const [wellnessLogs, setWellnessLogs] = useState<WellnessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    // Mood state
    selectedMood,
    setSelectedMood,
    energyLevel,
    setEnergyLevel,
    moodNotes,
    setMoodNotes,
    
    // Sleep state
    sleepHours,
    setSleepHours,
    sleepQuality,
    setSleepQuality,
    sleepNotes,
    setSleepNotes,
    
    // Stress state
    stressLevel,
    setStressLevel,
    stressNotes,
    setStressNotes,
    
    // Submit handlers
    handleMoodSubmit,
    handleSleepSubmit,
    handleStressSubmit,
  } = useWellnessForm({
    onSuccess: (logs) => {
      setWellnessLogs(logs);
      setError(null);
    },
    onError: (errorMessage) => {
      setError(errorMessage);
    }
  });

  useEffect(() => {
    const loadWellnessLogs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const logs = await getWellnessLogs(user.id);
          setWellnessLogs(logs);
        }
      } catch (error) {
        console.error('Error loading wellness logs:', error);
        setError('Error al cargar los registros');
      } finally {
        setLoading(false);
      }
    };

    loadWellnessLogs();
  }, []);

  const stats = useMemo(() => calculateWellnessStats(wellnessLogs), [wellnessLogs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-800">Bienestar</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('mood')}
          className={`px-4 py-2 ${activeTab === 'mood' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5" />
            <span>Estado de Ánimo</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sleep')}
          className={`px-4 py-2 ${activeTab === 'sleep' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            <span>Sueño</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('stress')}
          className={`px-4 py-2 ${activeTab === 'stress' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <span>Estrés</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 ${activeTab === 'reports' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Reportes</span>
          </div>
        </button>
      </div>

      {/* Content Sections */}
      <div className="mt-6">
        {activeTab === 'mood' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">¿Cómo te sientes?</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-lg text-center transition-all ${
                      selectedMood === mood.value
                        ? 'bg-orange-100 border-2 border-orange-500 scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-102'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-sm">{mood.label}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel de Energía
                  </label>
                  <input
                    type="range"
                    min={RANGES.ENERGY.MIN}
                    max={RANGES.ENERGY.MAX}
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Bajo</span>
                    <span>{energyLevel}/10</span>
                    <span>Alto</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="¿Hay algo específico que quieras anotar?"
                  ></textarea>
                </div>

                <button
                  onClick={handleMoodSubmit}
                  disabled={!selectedMood}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>Guardar Registro</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Registros Recientes</h2>
              <div className="space-y-4">
                {wellnessLogs
                  .filter(log => !log.mood.includes('_log'))
                  .slice(0, 5)
                  .map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium capitalize">{log.mood}</p>
                        <p className="text-sm text-gray-600">
                          Energía: {log.energy_level}/10
                          {log.notes && ` - ${log.notes}`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(log.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sleep' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Registro de Sueño</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas de Sueño
                  </label>
                  <input
                    type="number"
                    min={RANGES.SLEEP.MIN}
                    max={RANGES.SLEEP.MAX}
                    step={RANGES.SLEEP.STEP}
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calidad del Sueño
                  </label>
                  <input
                    type="range"
                    min={RANGES.QUALITY.MIN}
                    max={RANGES.QUALITY.MAX}
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Mala</span>
                    <span>{sleepQuality}/5</span>
                    <span>Excelente</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={sleepNotes}
                    onChange={(e) => setSleepNotes(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="¿Cómo fue tu sueño? ¿Tomaste siesta?"
                  ></textarea>
                </div>

                <button
                  onClick={handleSleepSubmit}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>Guardar Registro</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Historial de Sueño</h2>
              <div className="space-y-4">
                {wellnessLogs
                  .filter(log => log.mood === 'sleep_log')
                  .slice(0, 5)
                  .map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium">{log.sleep_hours} horas</p>
                        <p className="text-sm text-gray-600">
                          Calidad: {log.sleep_quality}/5
                          {log.notes && ` - ${log.notes}`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(log.created_at), "d 'de' MMMM", { locale: es })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stress' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Nivel de Estrés</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Qué tan estresado te sientes?
                  </label>
                  <input
                    type="range"
                    min={RANGES.STRESS.MIN}
                    max={RANGES.STRESS.MAX}
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Relajado</span>
                    <span>{stressLevel}/10</span>
                    <span>Muy Estresado</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={stressNotes}
                    onChange={(e) => setStressNotes(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="¿Qué está causando tu estrés?"
                  ></textarea>
                </div>

                <button
                  onClick={handleStressSubmit}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>Guardar Registro</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Historial de Estrés</h2>
              <div className="space-y-4">
                {wellnessLogs
                  .filter(log => log.mood === 'stress_log')
                  .slice(0, 5)
                  .map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium">Nivel {log.stress_level}/10</p>
                        {log.notes && <p className="text-sm text-gray-600">{log.notes}</p>}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(log.created_at), "d 'de' MMMM", { locale: es })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Resumen Mensual</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Estado de Ánimo</h3>
                  <p className="text-2xl font-bold text-orange-500">
                    {stats.totalMoodEntries} registros
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Promedio de Sueño</h3>
                  <p className="text-2xl font-bold text-orange-500">
                    {stats.averageSleep} horas
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Nivel de Estrés</h3>
                  <p className="text-2xl font-bold text-orange-500">
                    {stats.averageStress}/10
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Calidad de Sueño</h3>
                  <p className="text-2xl font-bold text-orange-500">
                    {stats.sleepQualityAverage}/5
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Nivel de Energía</h3>
                  <p className="text-2xl font-bold text-orange-500">
                    {stats.averageEnergy}/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
