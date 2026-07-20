import {
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Wind,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import type { ForecastDay, IntelligenceSnapshot } from '../types';

const weatherIcon = (condition: ForecastDay['condition']) =>
  condition === 'rain' || condition === 'storm' ? CloudRain : CloudSun;

export function WeatherPanel({ snapshot }: { snapshot: IntelligenceSnapshot }) {
  const { weather } = snapshot;
  const metrics = [
    { label: 'Humidity', value: `${weather.humidity}%`, icon: Droplets },
    { label: 'Rainfall', value: `${weather.rainfall} mm`, icon: CloudRain },
    { label: 'Wind', value: `${weather.windSpeed} km/h`, icon: Wind },
    { label: 'UV index', value: `${weather.uvIndex}/11`, icon: Gauge },
  ];
  return (
    <Card className="relative overflow-hidden p-5 sm:p-6">
      <div className="absolute -right-9 -top-12 size-36 rounded-full bg-brand-soft/65 blur-2xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
              Live weather
            </p>
            <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
              {snapshot.location.city}, {snapshot.location.country}
            </p>
          </div>
          <span className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-[11px] font-bold text-brand-dark">
            Open-Meteo ready
          </span>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-[16px] bg-warning-soft text-warning-text">
              <CloudSun size={26} />
            </span>
            <div>
              <p className="text-4xl font-extrabold tracking-[-0.07em]">
                {weather.temperature}°
              </p>
              <p className="mt-1 text-xs font-medium text-muted">
                {weather.condition} · feels like {weather.feelsLike}°
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Air quality
            </p>
            <p className="mt-1 text-sm font-extrabold text-brand-dark">
              {weather.airQuality}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 border-t border-line pt-4 sm:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-canvas/62 p-3">
              <Icon size={15} className="text-brand" />
              <p className="mt-2 text-sm font-extrabold tracking-[-0.03em]">
                {value}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-canvas/42 px-3 py-2.5 text-[11px] font-semibold text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Sunrise size={14} className="text-warning" /> Sunrise{' '}
            {weather.sunrise}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sunset size={14} className="text-warning-text" /> Sunset{' '}
            {weather.sunset}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function WeeklyForecast({ forecast }: { forecast: ForecastDay[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
            Weekly forecast
          </p>
          <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            Seven days ahead
          </p>
        </div>
        <p className="text-xs font-semibold text-brand-dark">Rain-aware care</p>
      </div>
      <div className="mt-5 grid grid-flow-col auto-cols-[78px] gap-2 overflow-x-auto pb-1 sm:auto-cols-fr">
        {forecast.map((day, index) => {
          const Icon = weatherIcon(day.condition);
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`rounded-[16px] border p-3 text-center ${index === 0 ? 'border-brand/25 bg-brand-soft/45' : 'border-line bg-canvas/42'}`}
            >
              <p className="text-[10px] font-bold text-muted">{day.day}</p>
              <p className="mt-1 text-[9px] text-muted/80">{day.date}</p>
              <Icon
                size={18}
                className={`mx-auto mt-3 ${day.condition === 'rain' || day.condition === 'storm' ? 'text-chart-secondary' : 'text-warning'}`}
              />
              <p className="mt-3 text-xs font-extrabold">{day.high}°</p>
              <p className="mt-1 text-[10px] text-muted">{day.low}°</p>
              <p className="mt-2 text-[10px] font-semibold text-brand-dark">
                {day.rainChance}% rain
              </p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
