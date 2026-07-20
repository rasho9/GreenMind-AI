import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CloudRain, Droplets, Leaf, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui';
import type { WaterIntelligence as WaterIntelligenceType } from '../types';

function WaterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[10px] font-bold text-ink shadow-card">
      {payload.map((item) => (
        <p key={item.name}>
          {item.name}: {item.value}%
        </p>
      ))}
    </div>
  );
}

export function WaterIntelligence({ water }: { water: WaterIntelligenceType }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
            Water intelligence
          </p>
          <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            Rain-aware water plan
          </p>
        </div>
        <span className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-[11px] font-bold text-brand-dark">
          {water.saving}% estimated savings
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-[16px] bg-brand-soft/48 p-3">
          <Droplets size={16} className="text-brand" />
          <p className="mt-2 text-xl font-extrabold tracking-[-0.05em] text-brand-dark">
            {water.todayNeed}%
          </p>
          <p className="mt-1 text-[10px] font-bold text-muted">Today’s need</p>
        </div>
        <div className="rounded-[16px] bg-canvas/58 p-3">
          <CloudRain size={16} className="text-chart-secondary" />
          <p className="mt-2 text-xl font-extrabold tracking-[-0.05em]">Sat</p>
          <p className="mt-1 text-[10px] font-bold text-muted">
            Rain adjustment
          </p>
        </div>
        <div className="rounded-[16px] bg-canvas/58 p-3">
          <TrendingDown size={16} className="text-brand" />
          <p className="mt-2 text-xl font-extrabold tracking-[-0.05em]">18%</p>
          <p className="mt-1 text-[10px] font-bold text-muted">Water saved</p>
        </div>
      </div>
      <div className="mt-5 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={water.weeklySchedule}
            margin={{ top: 12, right: 0, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="water-need" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="rgb(var(--chart-primary))"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="rgb(var(--chart-primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="rgb(var(--chart-grid))"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: 'rgb(var(--chart-label))',
                fontSize: 11,
                fontWeight: 600,
              }}
              dy={10}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<WaterTooltip />} />
            <Area
              type="monotone"
              name="Water need"
              dataKey="need"
              stroke="rgb(var(--chart-primary))"
              strokeWidth={2.5}
              fill="url(#water-need)"
            />
            <Area
              type="monotone"
              name="Rain chance"
              dataKey="rain"
              stroke="rgb(var(--chart-secondary))"
              strokeDasharray="4 4"
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 flex items-center gap-2 text-[11px] leading-5 text-muted">
        <Leaf size={14} className="shrink-0 text-brand" />{' '}
        {water.rainAdjustment}
      </p>
    </Card>
  );
}
