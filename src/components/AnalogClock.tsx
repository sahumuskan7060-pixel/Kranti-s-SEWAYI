import { POPULAR_TIMEZONES, type TimeZoneInfo } from '@/lib/timezone';

/**
 * Analog Clock Component (Bonus)
 */
export function AnalogClock({ timezone }: { timezone: TimeZoneInfo }) {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone.name,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const timeString = formatter.format(date);
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  // Calculate rotation angles
  const secondRotation = (seconds / 60) * 360;
  const minuteRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourRotation = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-64 bg-white rounded-full shadow-2xl border-8 border-gray-800">
        {/* Clock Face Numbers */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
          const angle = ((num - 3) * 30) * (Math.PI / 180);
          const x = 120 + 100 * Math.cos(angle);
          const y = 120 + 100 * Math.sin(angle);
          return (
            <div
              key={num}
              className="absolute w-8 h-8 flex items-center justify-center font-bold text-lg text-gray-800"
              style={{
                left: `${x - 16}px`,
                top: `${y - 16}px`,
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full z-10" />

        {/* Hour Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-20 bg-gray-800 rounded-full origin-bottom transform -translate-x-1/2"
          style={{
            transform: `translate(-50%, -100%) rotate(${hourRotation}deg)`,
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1.5 h-28 bg-gray-600 rounded-full origin-bottom transform -translate-x-1/2"
          style={{
            transform: `translate(-50%, -100%) rotate(${minuteRotation}deg)`,
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-32 bg-red-500 rounded-full origin-bottom transform -translate-x-1/2"
          style={{
            transform: `translate(-50%, -100%) rotate(${secondRotation}deg)`,
          }}
        />
      </div>
    </div>
  );
}
