import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { logWellness, getWellnessLogs } from '../lib/api';
import { DEFAULT_VALUES } from '../constants/wellness';
import { AppError } from '../utils/errorUtils';

interface UseWellnessFormProps {
  onSuccess: (logs: any[]) => void;
  onError: (error: string) => void;
}

export const useWellnessForm = ({ onSuccess, onError }: UseWellnessFormProps) => {
  // Mood tracking state
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState(DEFAULT_VALUES.ENERGY_LEVEL);
  const [moodNotes, setMoodNotes] = useState('');

  // Sleep tracking state
  const [sleepHours, setSleepHours] = useState(DEFAULT_VALUES.SLEEP_HOURS);
  const [sleepQuality, setSleepQuality] = useState(DEFAULT_VALUES.SLEEP_QUALITY);
  const [sleepNotes, setSleepNotes] = useState('');

  // Stress tracking state
  const [stressLevel, setStressLevel] = useState(DEFAULT_VALUES.STRESS_LEVEL);
  const [stressNotes, setStressNotes] = useState('');

  const resetMoodForm = () => {
    setSelectedMood(null);
    setEnergyLevel(DEFAULT_VALUES.ENERGY_LEVEL);
    setMoodNotes('');
  };

  const resetSleepForm = () => {
    setSleepHours(DEFAULT_VALUES.SLEEP_HOURS);
    setSleepQuality(DEFAULT_VALUES.SLEEP_QUALITY);
    setSleepNotes('');
  };

  const resetStressForm = () => {
    setStressLevel(DEFAULT_VALUES.STRESS_LEVEL);
    setStressNotes('');
  };

  const handleSubmit = async (type: 'mood' | 'sleep' | 'stress') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Usuario no autenticado', 'AUTH_ERROR');

      if (type === 'mood' && !selectedMood) {
        throw new AppError('Por favor selecciona un estado de ánimo', 'VALIDATION_ERROR');
      }

      const baseData = {
        user_id: user.id,
        energy_level: energyLevel,
      };

      let logData;
      switch (type) {
        case 'mood':
          logData = {
            ...baseData,
            mood: selectedMood,
            notes: moodNotes
          };
          break;
        case 'sleep':
          logData = {
            ...baseData,
            mood: 'sleep_log',
            sleep_hours: sleepHours,
            sleep_quality: sleepQuality,
            notes: sleepNotes
          };
          break;
        case 'stress':
          logData = {
            ...baseData,
            mood: 'stress_log',
            stress_level: stressLevel,
            notes: stressNotes
          };
          break;
      }

      await logWellness(logData);

      // Reset form
      switch (type) {
        case 'mood':
          resetMoodForm();
          break;
        case 'sleep':
          resetSleepForm();
          break;
        case 'stress':
          resetStressForm();
          break;
      }

      // Reload logs
      const logs = await getWellnessLogs(user.id);
      onSuccess(logs);
    } catch (error) {
      console.error(`Error logging ${type}:`, error);
      onError(error instanceof AppError ? error.message : 'Error al guardar el registro');
    }
  };

  return {
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
    handleMoodSubmit: () => handleSubmit('mood'),
    handleSleepSubmit: () => handleSubmit('sleep'),
    handleStressSubmit: () => handleSubmit('stress'),
  };
};
