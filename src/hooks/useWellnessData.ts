import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getWellnessLogs } from '../lib/api';
import { getErrorMessage } from '../utils/errorUtils';
import { Database } from '../types/database.types';

type WellnessLog = Database['public']['Tables']['wellness_logs']['Row'];

interface UseWellnessDataReturn {
  logs: WellnessLog[];
  loading: boolean;
  error: string | null;
  refreshLogs: () => Promise<void>;
}

export const useWellnessData = (): UseWellnessDataReturn => {
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user found');
      }

      const logs = await getWellnessLogs(user.id);
      setLogs(logs);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refreshLogs: fetchLogs
  };
};
