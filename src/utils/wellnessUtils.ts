import { Database } from '../types/database.types';

type WellnessLog = Database['public']['Tables']['wellness_logs']['Row'];

export const calculateWellnessStats = (logs: WellnessLog[]) => {
  const moodLogs = logs.filter(log => !log.mood.includes('_log'));
  const sleepLogs = logs.filter(log => log.mood === 'sleep_log');
  const stressLogs = logs.filter(log => log.mood === 'stress_log');

  const averageSleep = sleepLogs.length > 0
    ? Number((sleepLogs.reduce((acc, log) => acc + (log.sleep_hours || 0), 0) / sleepLogs.length).toFixed(1))
    : 0;

  const averageStress = stressLogs.length > 0
    ? Number((stressLogs.reduce((acc, log) => acc + (log.stress_level || 0), 0) / stressLogs.length).toFixed(1))
    : 0;

  const averageEnergy = logs.length > 0
    ? Number((logs.reduce((acc, log) => acc + log.energy_level, 0) / logs.length).toFixed(1))
    : 0;

  const moodDistribution = moodLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sleepQualityAverage = sleepLogs.length > 0
    ? Number((sleepLogs.reduce((acc, log) => acc + (log.sleep_quality || 0), 0) / sleepLogs.length).toFixed(1))
    : 0;

  return {
    totalMoodEntries: moodLogs.length,
    totalSleepEntries: sleepLogs.length,
    totalStressEntries: stressLogs.length,
    averageSleep,
    averageStress,
    averageEnergy,
    moodDistribution,
    sleepQualityAverage,
  };
};
