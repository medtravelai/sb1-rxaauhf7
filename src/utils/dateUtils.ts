import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = "d 'de' MMMM, HH:mm") => {
  return format(new Date(date), formatStr, { locale: es });
};

export const getWeekRange = () => {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 })
  };
};

export const isWithinWeek = (date: string | Date) => {
  const { start, end } = getWeekRange();
  return isWithinInterval(new Date(date), { start, end });
};
