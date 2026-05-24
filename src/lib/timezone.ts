/**
 * Time Zone Configuration and Utilities
 */

export interface TimeZoneInfo {
  name: string;
  displayName: string;
  offset: string;
  region: string;
  utcIdentifier: string;
}

// Popular time zones around the world
export const POPULAR_TIMEZONES: TimeZoneInfo[] = [
  // Asia
  { name: 'Asia/Tokyo', displayName: 'Tokyo, Japan', offset: 'UTC+9', region: 'Asia', utcIdentifier: 'JST' },
  { name: 'Asia/Shanghai', displayName: 'Shanghai, China', offset: 'UTC+8', region: 'Asia', utcIdentifier: 'CST' },
  { name: 'Asia/Hong_Kong', displayName: 'Hong Kong', offset: 'UTC+8', region: 'Asia', utcIdentifier: 'HKT' },
  { name: 'Asia/Singapore', displayName: 'Singapore', offset: 'UTC+8', region: 'Asia', utcIdentifier: 'SGT' },
  { name: 'Asia/Bangkok', displayName: 'Bangkok, Thailand', offset: 'UTC+7', region: 'Asia', utcIdentifier: 'ICT' },
  { name: 'Asia/Kolkata', displayName: 'New Delhi, India', offset: 'UTC+5:30', region: 'Asia', utcIdentifier: 'IST' },
  { name: 'Asia/Karachi', displayName: 'Karachi, Pakistan', offset: 'UTC+5', region: 'Asia', utcIdentifier: 'PKT' },
  { name: 'Asia/Dubai', displayName: 'Dubai, UAE', offset: 'UTC+4', region: 'Asia', utcIdentifier: 'GST' },
  
  // Europe
  { name: 'Europe/London', displayName: 'London, UK', offset: 'UTC+0', region: 'Europe', utcIdentifier: 'GMT' },
  { name: 'Europe/Paris', displayName: 'Paris, France', offset: 'UTC+1', region: 'Europe', utcIdentifier: 'CET' },
  { name: 'Europe/Berlin', displayName: 'Berlin, Germany', offset: 'UTC+1', region: 'Europe', utcIdentifier: 'CET' },
  { name: 'Europe/Moscow', displayName: 'Moscow, Russia', offset: 'UTC+3', region: 'Europe', utcIdentifier: 'MSK' },
  { name: 'Europe/Istanbul', displayName: 'Istanbul, Turkey', offset: 'UTC+3', region: 'Europe', utcIdentifier: 'EET' },
  
  // Americas
  { name: 'America/New_York', displayName: 'New York, USA', offset: 'UTC-5', region: 'Americas', utcIdentifier: 'EST' },
  { name: 'America/Chicago', displayName: 'Chicago, USA', offset: 'UTC-6', region: 'Americas', utcIdentifier: 'CST' },
  { name: 'America/Denver', displayName: 'Denver, USA', offset: 'UTC-7', region: 'Americas', utcIdentifier: 'MST' },
  { name: 'America/Los_Angeles', displayName: 'Los Angeles, USA', offset: 'UTC-8', region: 'Americas', utcIdentifier: 'PST' },
  { name: 'America/Anchorage', displayName: 'Anchorage, USA', offset: 'UTC-9', region: 'Americas', utcIdentifier: 'AKST' },
  { name: 'Pacific/Honolulu', displayName: 'Honolulu, Hawaii', offset: 'UTC-10', region: 'Americas', utcIdentifier: 'HST' },
  { name: 'America/Toronto', displayName: 'Toronto, Canada', offset: 'UTC-5', region: 'Americas', utcIdentifier: 'EST' },
  { name: 'America/Mexico_City', displayName: 'Mexico City, Mexico', offset: 'UTC-6', region: 'Americas', utcIdentifier: 'CST' },
  { name: 'America/Sao_Paulo', displayName: 'São Paulo, Brazil', offset: 'UTC-3', region: 'Americas', utcIdentifier: 'BRT' },
  { name: 'America/Buenos_Aires', displayName: 'Buenos Aires, Argentina', offset: 'UTC-3', region: 'Americas', utcIdentifier: 'ART' },
  
  // Africa
  { name: 'Africa/Cairo', displayName: 'Cairo, Egypt', offset: 'UTC+2', region: 'Africa', utcIdentifier: 'EET' },
  { name: 'Africa/Johannesburg', displayName: 'Johannesburg, South Africa', offset: 'UTC+2', region: 'Africa', utcIdentifier: 'SAST' },
  { name: 'Africa/Lagos', displayName: 'Lagos, Nigeria', offset: 'UTC+1', region: 'Africa', utcIdentifier: 'WAT' },
  
  // Oceania
  { name: 'Australia/Sydney', displayName: 'Sydney, Australia', offset: 'UTC+10', region: 'Oceania', utcIdentifier: 'AEDT' },
  { name: 'Australia/Melbourne', displayName: 'Melbourne, Australia', offset: 'UTC+10', region: 'Oceania', utcIdentifier: 'AEDT' },
  { name: 'Pacific/Auckland', displayName: 'Auckland, New Zealand', offset: 'UTC+12', region: 'Oceania', utcIdentifier: 'NZDT' },
  { name: 'Pacific/Fiji', displayName: 'Fiji', offset: 'UTC+12', region: 'Oceania', utcIdentifier: 'FJT' },
];

/**
 * Get current time in a specific timezone
 */
export function getTimeInTimeZone(timezoneName: string): Date {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneName,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const partMap: Record<string, string> = {};

    parts.forEach(({ type, value }) => {
      partMap[type] = value;
    });

    const date = new Date(
      `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}:${partMap.second}Z`
    );

    return date;
  } catch (error) {
    console.error(`Invalid timezone: ${timezoneName}`, error);
    return new Date();
  }
}

/**
 * Format time for clock display
 */
export function formatClockTime(date: Date, format: '12h' | '24h' = '24h'): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (format === '12h') {
    const hour12 = date.getHours() % 12 || 12;
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${String(hour12).padStart(2, '0')}:${minutes}:${seconds} ${period}`;
  }

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formatter.format(date);
}

/**
 * Get time difference from UTC
 */
export function getUTCOffset(timezoneName: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneName,
      timeZoneName: 'longOffset',
    });

    const parts = formatter.formatToParts(new Date());
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');

    return offsetPart?.value || 'UTC';
  } catch (error) {
    return 'UTC';
  }
}

/**
 * Get emoji for timezone
 */
export function getTimeZoneEmoji(timezoneName: string): string {
  const emojiMap: Record<string, string> = {
    'Asia/Tokyo': '🗼',
    'Asia/Shanghai': '🏮',
    'Asia/Hong_Kong': '🌃',
    'Asia/Singapore': '🏝️',
    'Asia/Bangkok': '🕌',
    'Asia/Kolkata': '🕉️',
    'Asia/Karachi': '🕌',
    'Asia/Dubai': '🕌',
    'Europe/London': '🇬🇧',
    'Europe/Paris': '🗼',
    'Europe/Berlin': '🍺',
    'Europe/Moscow': '🛍️',
    'Europe/Istanbul': '🕌',
    'America/New_York': '🗽',
    'America/Chicago': '🌆',
    'America/Denver': '⛰️',
    'America/Los_Angeles': '🎬',
    'America/Anchorage': '🏔️',
    'Pacific/Honolulu': '🌺',
    'America/Toronto': '🍁',
    'America/Mexico_City': '🌮',
    'America/Sao_Paulo': '⚽',
    'America/Buenos_Aires': '🥩',
    'Africa/Cairo': '🏺',
    'Africa/Johannesburg': '🦁',
    'Africa/Lagos': '🥁',
    'Australia/Sydney': '🦘',
    'Australia/Melbourne': '🍺',
    'Pacific/Auckland': '🐑',
    'Pacific/Fiji': '🏝️',
  };

  return emojiMap[timezoneName] || '🌍';
}

/**
 * Check if it's day time
 */
export function isDaytime(date: Date): boolean {
  const hours = date.getHours();
  return hours >= 6 && hours < 18;
}

/**
 * Get all available timezones
 */
export function getAllTimezones(): string[] {
  return Intl.supportedValuesOf('timeZone');
}

/**
 * Search timezones by query
 */
export function searchTimezones(query: string): TimeZoneInfo[] {
  const lowerQuery = query.toLowerCase();
  return POPULAR_TIMEZONES.filter(
    (tz) =>
      tz.name.toLowerCase().includes(lowerQuery) ||
      tz.displayName.toLowerCase().includes(lowerQuery) ||
      tz.region.toLowerCase().includes(lowerQuery) ||
      tz.utcIdentifier.toLowerCase().includes(lowerQuery)
  );
}
