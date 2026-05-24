'use client';

import { useState, useEffect } from 'react';
import { POPULAR_TIMEZONES, searchTimezones, getTimeZoneEmoji, type TimeZoneInfo } from '@/lib/timezone';
import { useTimeZoneClock } from '@/hooks/useTimeZoneClock';

export function DigitalClockDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClock, setShowAddClock] = useState(false);
  const [filteredTimezones, setFilteredTimezones] = useState<TimeZoneInfo[]>(POPULAR_TIMEZONES);

  // Initialize with a few default timezones
  const { clocks, addClock, removeClock, toggleTimeFormat } = useTimeZoneClock([
    POPULAR_TIMEZONES.find((tz) => tz.name === 'Asia/Kolkata')!,
    POPULAR_TIMEZONES.find((tz) => tz.name === 'Europe/London')!,
    POPULAR_TIMEZONES.find((tz) => tz.name === 'America/New_York')!,
  ]);

  const regions = ['All', ...new Set(POPULAR_TIMEZONES.map((tz) => tz.region))];

  // Filter timezones based on search and region
  useEffect(() => {
    let filtered = POPULAR_TIMEZONES;

    if (selectedRegion !== 'All') {
      filtered = filtered.filter((tz) => tz.region === selectedRegion);
    }

    if (searchQuery) {
      filtered = searchTimezones(searchQuery);
    }

    setFilteredTimezones(filtered);
  }, [selectedRegion, searchQuery]);

  const handleAddClock = (timezone: TimeZoneInfo) => {
    addClock(timezone);
    setShowAddClock(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            ⏰ World Time Clock
          </h1>
          <p className="text-purple-300 text-lg">Track time across multiple time zones</p>
        </div>

        {/* Main Clock Grid */}
        {clocks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">My Clocks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clocks.map((clock, idx) => (
                <ClockCard
                  key={clock.timezone.name}
                  clock={clock}
                  onRemove={() => removeClock(clock.timezone.name)}
                  onToggleFormat={() => toggleTimeFormat(idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Clock Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddClock(!showAddClock)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105 shadow-lg"
          >
            {showAddClock ? '✕ Close' : '+ Add Clock'}
          </button>
        </div>

        {/* Add Clock Panel */}
        {showAddClock && (
          <div className="mb-12 bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-purple-500/20">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search timezone (e.g., Tokyo, London, New York)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-purple-500/30 focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            {/* Region Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedRegion === region
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {filteredTimezones.map((timezone) => (
                <button
                  key={timezone.name}
                  onClick={() => handleAddClock(timezone)}
                  className="text-left p-4 bg-slate-700 hover:bg-purple-600 text-white rounded-lg transition transform hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTimeZoneEmoji(timezone.name)}</span>
                    <div>
                      <p className="font-semibold">{timezone.displayName}</p>
                      <p className="text-sm text-slate-300">{timezone.offset}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Clock Card Component
 */
function ClockCard({
  clock,
  onRemove,
  onToggleFormat,
}: {
  clock: any;
  onRemove: () => void;
  onToggleFormat: () => void;
}) {
  const isDayTime = clock.isDaytime;
  const bgGradient = isDayTime
    ? 'from-yellow-400 via-orange-400 to-red-400'
    : 'from-indigo-600 via-purple-600 to-blue-800';

  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-2xl p-8 border-2 border-white/20 backdrop-blur transform transition hover:scale-105`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getTimeZoneEmoji(clock.timezone.name)}</span>
          <div>
            <h3 className="text-2xl font-bold text-white">{clock.timezone.displayName}</h3>
            <p className="text-white/80 text-sm">{clock.timezone.offset}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-white/60 hover:text-white text-2xl transition"
        >
          ✕
        </button>
      </div>

      {/* Digital Time Display */}
      <div className="mb-6 bg-black/30 rounded-xl p-6 border border-white/10">
        <p className="text-5xl md:text-6xl font-mono font-bold text-white text-center tracking-wider drop-shadow-lg">
          {clock.formattedTime}
        </p>
      </div>

      {/* Date Display */}
      <div className="mb-6 text-center">
        <p className="text-white/90 font-semibold text-lg">{clock.formattedDate}</p>
      </div>

      {/* Time of Day Indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="text-2xl">{isDayTime ? '☀️' : '🌙'}</span>
        <p className="text-white font-semibold">{isDayTime ? 'Daytime' : 'Nighttime'}</p>
      </div>

      {/* Format Toggle Button */}
      <button
        onClick={onToggleFormat}
        className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition border border-white/30"
      >
        Toggle 24/12 Hour Format
      </button>
    </div>
  );
}
