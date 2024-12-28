import React, { useState, useEffect } from 'react';
import { Map, Dumbbell, Play, Pause, Search, Plus, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { logExercise, getWorkoutPlans } from '../lib/api';

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  exercises: {
    name: string;
    duration: number;
    sets?: number;
    reps?: number;
  }[];
}

interface ExerciseLog {
  activity_type: string;
  duration: number;
  distance?: number;
  calories?: number;
  gps_data?: {
    coordinates: [number, number][];
    elevation: number[];
  };
  notes?: string;
}

interface Exercise {
  name: string;
  category: string;
  caloriesPerHour: number;
  description: string;
}

export const Exercise: React.FC = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentActivity, setCurrentActivity] = useState<ExerciseLog>({
    activity_type: 'running',
    duration: 0,
    distance: 0,
    calories: 0,
    gps_data: {
      coordinates: [],
      elevation: []
    }
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [dailySteps, setDailySteps] = useState(0);
  const [stepGoal] = useState(10000);

  const exerciseDatabase: Exercise[] = [
    {
      name: "Correr",
      category: "Cardio",
      caloriesPerHour: 600,
      description: "Correr al aire libre o en cinta"
    },
    {
      name: "Caminata",
      category: "Cardio",
      caloriesPerHour: 300,
      description: "Caminar a paso ligero"
    },
    {
      name: "Fútbol",
      category: "Deportes",
      caloriesPerHour: 500,
      description: "Partido de fútbol recreativo"
    },
    {
      name: "Bailar",
      category: "Cardio",
      caloriesPerHour: 400,
      description: "Baile aeróbico o zumba"
    },
    {
      name: "Natación",
      category: "Cardio",
      caloriesPerHour: 550,
      description: "Natación estilo libre"
    },
    {
      name: "Yoga",
      category: "Flexibilidad",
      caloriesPerHour: 250,
      description: "Práctica de yoga"
    },
    {
      name: "Pesas",
      category: "Fuerza",
      caloriesPerHour: 450,
      description: "Entrenamiento con pesas"
    },
    {
      name: "Ciclismo",
      category: "Cardio",
      caloriesPerHour: 500,
      description: "Ciclismo al aire libre o estacionario"
    }
  ];

  useEffect(() => {
    const loadWorkoutPlans = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const plans = await getWorkoutPlans(user.id);
          setWorkoutPlans(plans);
        }
      } catch (error) {
        console.error('Error loading workout plans:', error);
      }
    };

    // Simulated step counter
    const stepInterval = setInterval(() => {
      setDailySteps(prev => {
        const increment = Math.floor(Math.random() * 10); // Simulate random steps
        return prev + increment;
      });
    }, 5000);

    loadWorkoutPlans();
    return () => clearInterval(stepInterval);
  }, []);

  const startTracking = () => {
    if (!selectedExercise) {
      alert('Por favor selecciona un ejercicio primero');
      return;
    }

    setIsTracking(true);
    const startTime = Date.now();

    // Update duration every second
    const watch = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const calories = Math.floor((selectedExercise.caloriesPerHour / 3600) * elapsed);
      
      setCurrentActivity(prev => ({
        ...prev,
        activity_type: selectedExercise.name,
        duration: elapsed,
        calories
      }));
    }, 1000);

    setWatchId(watch);

    // Track GPS if available
    if (navigator.geolocation && selectedExercise.name.toLowerCase() === 'correr') {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentActivity(prev => ({
            ...prev,
            gps_data: {
              coordinates: [
                ...prev.gps_data!.coordinates,
                [position.coords.longitude, position.coords.latitude]
              ],
              elevation: [
                ...prev.gps_data!.elevation,
                position.coords.altitude || 0
              ]
            }
          }));
        },
        null,
        { enableHighAccuracy: true }
      );
    }
  };

  const stopTracking = async () => {
    if (watchId) {
      clearInterval(watchId);
      setWatchId(null);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Por favor inicia sesión para registrar ejercicios');
        return;
      }

      try {
        await logExercise({
          user_id: user.id,
          ...currentActivity
        });

        setCurrentActivity({
          activity_type: selectedExercise?.name || 'running',
          duration: 0,
          distance: 0,
          calories: 0,
          gps_data: {
            coordinates: [],
            elevation: []
          }
        });

        alert('Ejercicio registrado exitosamente');
      } catch (error) {
        console.error('Error logging exercise:', error);
        if (error instanceof Error) {
          if (error.message.includes('no encontró el usuario') || error.message.includes('verificar el usuario')) {
            // Try to refresh the page to get a new session
            window.location.reload();
            return;
          }
          alert(error.message);
        } else {
          alert('Error al registrar el ejercicio');
        }
      }
    } catch (authError) {
      console.error('Auth error:', authError);
      alert('Error de autenticación. Por favor inicia sesión nuevamente.');
    }

    setIsTracking(false);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredExercises = exerciseDatabase.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-800">Actividad Física</h1>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 ${activeTab === 'database' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            <span>Ejercicios</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2 ${activeTab === 'tracking' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            <span>Seguimiento</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* Steps Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-6 h-6 text-orange-500" />
              Pasos Diarios
            </h2>
            <span className="text-2xl font-bold text-orange-500">{dailySteps.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-orange-500 h-2.5 rounded-full"
              style={{ width: `${Math.min((dailySteps / stepGoal) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Meta: {stepGoal.toLocaleString()} pasos</p>
        </div>

        {activeTab === 'database' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Base de Datos de Ejercicios</h2>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ejercicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredExercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedExercise?.name === exercise.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-sm text-gray-600">{exercise.category}</p>
                      <p className="text-orange-600">{exercise.caloriesPerHour} cal/hora</p>
                      <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedExercise(exercise);
                        setActiveTab('tracking');
                      }}
                      className="p-2 text-orange-500 hover:bg-orange-50 rounded-full"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Seguimiento de Ejercicio</h2>
              {selectedExercise ? (
                <div className="mb-4">
                  <p className="font-medium">{selectedExercise.name}</p>
                  <p className="text-sm text-gray-600">{selectedExercise.description}</p>
                </div>
              ) : (
                <p className="text-gray-600">Selecciona un ejercicio de la base de datos para comenzar</p>
              )}
            </div>

            {selectedExercise && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="text-xl font-semibold">{formatDuration(currentActivity.duration)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Calorías</p>
                    <p className="text-xl font-semibold">{currentActivity.calories}</p>
                  </div>
                  {currentActivity.distance !== undefined && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Distancia</p>
                      <p className="text-xl font-semibold">{currentActivity.distance.toFixed(2)} km</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  {!isTracking ? (
                    <button
                      onClick={startTracking}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      <span>Comenzar</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopTracking}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Pause className="w-5 h-5" />
                      <span>Detener</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
