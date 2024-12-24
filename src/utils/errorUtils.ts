import { PostgrestError } from '@supabase/supabase-js';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error | PostgrestError
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, undefined, error);
  }

  return new AppError('An unexpected error occurred');
};

export const getErrorMessage = (error: unknown): string => {
  const appError = handleError(error);
  
  // Common error messages in Spanish
  const errorMessages: Record<string, string> = {
    'UNAUTHORIZED': 'No estás autorizado para realizar esta acción',
    'NOT_FOUND': 'No se encontró el recurso solicitado',
    'VALIDATION_ERROR': 'Los datos proporcionados no son válidos',
    'NETWORK_ERROR': 'Error de conexión. Por favor, verifica tu conexión a internet',
    'DEFAULT': 'Ha ocurrido un error. Por favor, inténtalo de nuevo'
  };

  return errorMessages[appError.code || ''] || appError.message || errorMessages.DEFAULT;
};
