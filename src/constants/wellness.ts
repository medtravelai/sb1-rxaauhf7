export const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Contento', value: 'contento' },
  { emoji: '😴', label: 'Cansado', value: 'cansado' },
  { emoji: '😤', label: 'Estresado', value: 'estresado' },
  { emoji: '😔', label: 'Triste', value: 'triste' },
  { emoji: '🤗', label: 'Tranquilo', value: 'tranquilo' },
  { emoji: '💪', label: 'Motivado', value: 'motivado' },
] as const;

export const DEFAULT_VALUES = {
  ENERGY_LEVEL: 5,
  SLEEP_HOURS: 7,
  SLEEP_QUALITY: 3,
  STRESS_LEVEL: 5,
} as const;

export const RANGES = {
  ENERGY: { MIN: 1, MAX: 10 },
  SLEEP: { MIN: 0, MAX: 24, STEP: 0.5 },
  QUALITY: { MIN: 1, MAX: 5 },
  STRESS: { MIN: 1, MAX: 10 },
} as const;
