import React, { useState, useEffect } from 'react';
import { Map, Running, Video, Dumbbell, Users, Trophy, Play, Pause, Save } from 'lucide-react';
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

export const Exercise: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isTracking, setIsTracking] = useState(false);
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

    loadWorkoutPlans();
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentActivity(prev => ({
          ...prev,
          gps_data: {
            coordinates: [
              ...(prev.gps_data?.coordinates || []),
              [position.coords.longitude, position.coords.latitude]
            ],
            elevation: [
              ...(prev.gps_data?.elevation || []),
              position.coords.altitude || 0
            ]
          }
        }));
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Error getting location. Please check your GPS settings.');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    setWatchId(id);
    setIsTracking(true);

    // Start duration timer
    const timer = setInterval(() => {
      setCurrentActivity(prev => ({
        ...prev,
        duration: prev.duration + 1
      }));
    }, 1000);

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearInterval(timer);
    };
  };

  const stopTracking = async () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await logExercise({
          user_id: user.id,
          ...currentActivity
        });
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error saving exercise data');
    }

    // Reset current activity
    setCurrentActivity({
      activity_type: 'running',
      duration: 0,
      distance: 0,
      calories: 0,
      gps_data: {
        coordinates: [],
        elevation: []
      }
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDistance = (coordinates: [number, number][]): number => {
    if (coordinates.length < 2) return 0;
    
    let distance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [lon1, lat1] = coordinates[i - 1];
      const [lon2, lat2] = coordinates[i];
      
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance += R * c;
    }
    
    return distance;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-800">Actividad Física</h1>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2 ${activeTab === 'tracking' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            <span>GPS Tracking</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 ${activeTab === 'videos' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            <span>Videos</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 ${activeTab === 'plans' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            <span>Planes</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 ${activeTab === 'social' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Social</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sports')}
          className={`px-4 py-2 ${activeTab === 'sports' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>Deportes</span>
          </div>
        </button>
      </div>

      {/* Content Sections */}
      <div className="mt-6">
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Seguimiento GPS</h2>
              <div className="aspect-video bg-gray-100 rounded-lg mb-4">
                {/* Map will be integrated here */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {currentActivity.gps_data?.coordinates.length > 0 ? (
                    'Ruta en progreso...'
                  ) : (
                    'Presiona Iniciar para comenzar el seguimiento'
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-gray-600">Distancia</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {calculateDistance(currentActivity.gps_data?.coordinates || []).toFixed(2)} km
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Tiempo</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatDuration(currentActivity.duration)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Calorías</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(currentActivity.duration * 0.1)} cal
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                {!isTracking ? (
                  <button
                    onClick={startTracking}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Iniciar</span>
                  </button>
                ) : (
                  <button
                    onClick={stopTracking}
                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Detener</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workoutPlans.map((plan) => (
              <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="space-y-2">
                  {plan.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span>{exercise.name}</span>
                      <span className="text-gray-600">
                        {exercise.sets ? `${exercise.sets}x${exercise.reps}` : `${exercise.duration} min`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    {plan.difficulty}
                  </span>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Comenzar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4">
                {/* Video player will be integrated here */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Video de ejercicios
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rutina de Cardio Latino</h3>
              <p className="text-gray-600">30 minutos de ejercicios con música latina</p>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Comunidad</h2>
            <p className="text-gray-600">Conecta con otros usuarios próximamente...</p>
          </div>
        )}

        {activeTab === 'sports' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Deportes Tradicionales</h2>
            <p className="text-gray-600">Encuentra grupos y eventos deportivos próximamente...</p>
          </div>
        )}
      </div>
    </div>
  );
};
