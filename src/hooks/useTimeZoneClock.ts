import { useState, useEffect, useCallback } from 'react';
import { getTimeInTimeZone, formatClockTime, formatDate, type TimeZoneInfo } from '@/lib/timezone';

export interface ClockData {
  timezone: TimeZoneInfo;
  currentTime: Date;
  formattedTime: string;
  formattedDate: string;
  isDaytime: boolean;
}

export interface UseTimeZoneClockReturn {
  clocks: ClockData[];
  addClock: (timezone: TimeZoneInfo) => void;
  removeClock: (timezoneName: string) => void;
  toggleTimeFormat: (index: number) => void;
}

/**
 * Hook for managing multiple timezone clocks
 */
export function useTimeZoneClock(initialTimezones: TimeZoneInfo[] = []): UseTimeZoneClockReturn {
  const [clocks, setClocks] = useState<ClockData[]>([]);
  const [timeFormat, setTimeFormat] = useState<('12h' | '24h')[]>([]);

  // Initialize clocks
  useEffect(() => {
    if (initialTimezones.length > 0) {
      const newClocks = initialTimezones.map((tz) => {
        const currentTime = getTimeInTimeZone(tz.name);
        return {
          timezone: tz,
          currentTime,
          formattedTime: formatClockTime(currentTime, '24h'),
          formattedDate: formatDate(currentTime),
          isDaytime: currentTime.getHours() >= 6 && currentTime.getHours() < 18,
        };
      });
      setClocks(newClocks);
      setTimeFormat(Array(newClocks.length).fill('24h'));
    }
  }, []);

  // Update time every second
  useEffect(() => {
    if (clocks.length === 0) return;

    const interval = setInterval(() => {
      setClocks((prevClocks) =>
        prevClocks.map((clock, idx) => {
          const currentTime = getTimeInTimeZone(clock.timezone.name);
          return {
            ...clock,
            currentTime,
            formattedTime: formatClockTime(currentTime, timeFormat[idx] || '24h'),
            formattedDate: formatDate(currentTime),
            isDaytime: currentTime.getHours() >= 6 && currentTime.getHours() < 18,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [clocks.length, timeFormat]);

  const addClock = useCallback((timezone: TimeZoneInfo) => {
    setClocks((prev) => {
      // Avoid duplicates
      if (prev.some((c) => c.timezone.name === timezone.name)) {
        return prev;
      }

      const currentTime = getTimeInTimeZone(timezone.name);
      return [
        ...prev,
        {
          timezone,
          currentTime,
          formattedTime: formatClockTime(currentTime, '24h'),
          formattedDate: formatDate(currentTime),
          isDaytime: currentTime.getHours() >= 6 && currentTime.getHours() < 18,
        },
      ];
    });
    setTimeFormat((prev) => [...prev, '24h']);
  }, []);

  const removeClock = useCallback((timezoneName: string) => {
    setClocks((prev) => prev.filter((c) => c.timezone.name !== timezoneName));
    setTimeFormat((prev) => {
      const idx = clocks.findIndex((c) => c.timezone.name === timezoneName);
      return prev.filter((_, i) => i !== idx);
    });
  }, [clocks]);

  const toggleTimeFormat = useCallback((index: number) => {
    setTimeFormat((prev) => {
      const newFormat = [...prev];
      newFormat[index] = newFormat[index] === '24h' ? '12h' : '24h';
      return newFormat;
    });
  }, []);

  return { clocks, addClock, removeClock, toggleTimeFormat };
}
