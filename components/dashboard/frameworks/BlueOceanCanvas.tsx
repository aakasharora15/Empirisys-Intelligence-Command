'use client';

import { Competitor } from '@/lib/db';
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';

interface BlueOceanCanvasProps {
  competitors: Competitor[];
}

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-xs font-bold text-text-secondary mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <span style={{ color: entry.color }} className="text-sm font-bold">
              {entry.name} : {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BlueOceanCanvas({ competitors: _competitors }: BlueOceanCanvasProps) {
  const canvasData = [
    { subject: 'Retrospective Logging', Legacy: 90, Empirisys: 20 },
    { subject: 'UI Complexity', Legacy: 85, Empirisys: 30 },
    { subject: 'Price / TCO', Legacy: 80, Empirisys: 40 },
    { subject: 'Predictive Safety AI', Legacy: 10, Empirisys: 95 },
    { subject: 'Contextual NLP', Legacy: 15, Empirisys: 90 },
    { subject: 'Consulting Advisory', Legacy: 50, Empirisys: 95 },
  ];

  return (
    <div className="w-full px-6 md:px-10 mb-20 max-w-[1600px] mx-auto mt-16">
      <div className="mb-8">
        <h3 className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
          Framework 02 • Blue Ocean Strategy Canvas
        </h3>
        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
          We compete where legacy can&apos;t follow.
        </h2>
        <p className="text-base text-text-secondary mt-2">
          The radar strategy canvas plots both value curves — the overlap is minimal by design.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Chart */}
        <div className="h-[500px] w-full bg-card rounded-2xl border border-card-border/50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={canvasData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={(props: {
                  payload: { value: string };
                  x: number | string;
                  y: number | string;
                  textAnchor: 'inherit' | 'end' | 'middle' | 'start' | undefined;
                  stroke: string;
                }) => {
                  const { payload, x, y, textAnchor, stroke } = props;
                  return (
                    <g className="recharts-layer recharts-polar-angle-axis-tick">
                      <text
                        stroke={stroke}
                        x={x}
                        y={y}
                        className="recharts-text recharts-polar-angle-axis-tick-value"
                        textAnchor={textAnchor}
                        fill={
                          payload.value.includes('Predictive') ||
                          payload.value.includes('Contextual') ||
                          payload.value.includes('Consulting')
                            ? 'var(--color-primary)'
                            : '#9CA3AF'
                        }
                        fontSize="13"
                        fontWeight="bold"
                      >
                        <tspan x={x} dy="0em">
                          {payload.value}
                        </tspan>
                      </text>
                    </g>
                  );
                }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Legacy systems"
                dataKey="Legacy"
                stroke="#6B7280"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="transparent"
              />
              <Radar
                name="Empirisys (BOOST)"
                dataKey="Empirisys"
                stroke="#7AE03B"
                strokeWidth={3}
                fill="#7AE03B"
                fillOpacity={0.15}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Side: Information Cards */}
        <div className="flex flex-col gap-4">
          {/* Legend Card */}
          <div className="bg-card rounded-xl border border-card-border/50 p-5 flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-1 bg-accent rounded-full" />
              <span className="text-sm font-bold text-text-primary">Empirisys (BOOST)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-0.5 border-t-2 border-dashed border-[#6B7280]" />
              <span className="text-sm font-bold text-text-secondary">Legacy systems</span>
            </div>
          </div>

          {/* Legacy Card */}
          <div className="bg-card rounded-xl border border-card-border/50 p-6 flex-1">
            <h4 className="text-xs font-bold tracking-widest text-text-secondary uppercase mb-3">
              Where legacy scores high
            </h4>
            <p className="text-sm text-text-primary leading-loose font-medium">
              Retrospective logging depth, UI complexity, and total cost — factors buyers tolerate,
              not value.
            </p>
          </div>

          {/* Empirisys Uncontested Card */}
          <div className="bg-card rounded-xl border border-accent/40 p-6 flex-1">
            <h4 className="text-xs font-bold tracking-widest text-accent uppercase mb-4">
              Our uncontested space
            </h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3">
                <span className="text-accent font-bold">✓</span>
                <span className="text-base font-bold text-text-primary">Predictive Safety AI</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent font-bold">✓</span>
                <span className="text-base font-bold text-text-primary">Contextual NLP</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent font-bold">✓</span>
                <span className="text-base font-bold text-text-primary">
                  Specialized Consulting Advisory
                </span>
              </li>
            </ul>
            <p className="text-sm text-text-secondary">
              Axes where no legacy incumbent registers a meaningful score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
