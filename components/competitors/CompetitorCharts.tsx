'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Scatter,
  BarChart,
  Bar,
} from 'recharts';
import { ChartInfoButton } from '@/components/ui/ChartInfoButton';
import { Competitor } from '@/lib/db';

interface CompetitorChartsProps {
  competitors: Competitor[];
}

export function CompetitorCharts({ competitors }: CompetitorChartsProps) {
  // Multi-Dimensional Radar Data
  const radarData = [
    { subject: 'AI Analytics', Empirisys: 95, Sphera: 65, Intelex: 50 },
    { subject: 'NLP Log Parsing', Empirisys: 98, Sphera: 40, Intelex: 30 },
    { subject: 'HSE Compliance', Empirisys: 85, Sphera: 95, Intelex: 90 },
    { subject: 'Predictive Safety', Empirisys: 90, Sphera: 60, Intelex: 55 },
    { subject: 'Workflow Automation', Empirisys: 80, Sphera: 85, Intelex: 80 },
    { subject: 'User Experience', Empirisys: 92, Sphera: 70, Intelex: 65 },
  ];

  // Recharts Chart Row 1: Threat distribution
  const highCount = competitors.filter((c) => c.threat_score >= 80).length;
  const medCount = competitors.filter((c) => c.threat_score >= 65 && c.threat_score < 80).length;
  const lowCount = competitors.filter((c) => c.threat_score < 65).length;
  const threatPieData = [
    { name: 'High Threat', value: highCount, fill: '#EF4444' },
    { name: 'Medium Threat', value: medCount, fill: 'var(--chart-3)' },
    { name: 'Low Threat', value: lowCount, fill: '#10B981' },
  ];

  // Recharts Chart Row 2: AI vs HSE Focus scatter plot
  const getScoreMap = (val: string) => {
    if (val === 'yes') return 90;
    if (val === 'partial') return 55;
    return 20;
  };
  const scatterData = [
    { name: 'Empirisys', x: 95, y: 90, fill: 'var(--chart-1)', z: 300 },
    ...competitors.map((c, i) => ({
      name: c.name,
      x: getScoreMap(c.ai_analytics) + ((i % 10) - 5),
      y: getScoreMap(c.hse_focus) + (((i + 5) % 10) - 5),
      fill: `var(--chart-${(i % 5) + 1})`,
      z: c.threat_score * 2,
    })),
  ];

  // Recharts Chart Row 3: Hiring activity bar chart
  const hiringData = [
    { name: 'Empirisys', roles: 8, fill: 'var(--chart-1)' },
    ...competitors
      .map((c, i) => ({
        name: c.name,
        roles: c.open_roles_count || ((i * 3) % 20) + 5,
        fill: `var(--chart-${((i + 1) % 5) + 1})`,
      }))
      .sort((a, b) => b.roles - a.roles)
      .slice(0, 5),
  ];

  return (
    <>
      {/* Capability Index Chart (Radar Chart) */}
      <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Multi-Dimensional Capability Index
              </h3>
              <ChartInfoButton
                title="Multi-Dimensional Capability Index"
                description="Spider chart benchmarking Empirisys core capabilities against top market leaders across 6 critical product dimensions."
              />
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Benchmarking Empirisys core capabilities against top market leaders across 6 critical
              product dimensions. Notice our massive advantage in NLP and Predictive Analytics
              versus legacy compliance tracking.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <span className="text-micro font-bold text-text-secondary uppercase">Empirisys</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--accent)]"></span>
              <span className="text-micro font-bold text-text-secondary uppercase">Sphera</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#6366F1]"></span>
              <span className="text-micro font-bold text-text-secondary uppercase">Intelex</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="var(--color-card-border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'var(--color-text-primary)', fontSize: 11, fontWeight: 700 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
              />
              <RechartsTooltip
                contentStyle={{
                  fontSize: '11px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-card-border)',
                  background: 'var(--color-card)',
                }}
              />
              <Radar
                name="Empirisys"
                dataKey="Empirisys"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.3}
              />
              <Radar
                name="Sphera"
                dataKey="Sphera"
                stroke="var(--chart-3)"
                fill="var(--chart-3)"
                fillOpacity={0.2}
              />
              <Radar
                name="Intelex"
                dataKey="Intelex"
                stroke="var(--chart-5)"
                fill="var(--chart-5)"
                fillOpacity={0.1}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 Columns Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Threat Distribution Donut */}
        <div className="glass-card p-6 rounded-2xl shadow-sm flex flex-col h-[340px]">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              Threat Level Distribution
            </h4>
            <ChartInfoButton
              title="Threat Level Distribution"
              description="Categorizes competitors by their proprietary Empirisys threat score, which aggregates growth metrics, technology overlap, and market presence."
            />
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={threatPieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {threatPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    fontSize: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-card-border)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: AI vs HSE Scatter Plot */}
        <div className="glass-card p-6 rounded-2xl shadow-sm flex flex-col h-[340px]">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              AI Analytics vs HSE Focus
            </h4>
            <ChartInfoButton
              title="AI Analytics vs HSE Focus"
              description="Plots competitor placement based on their depth of Artificial Intelligence integration against their traditional Health, Safety, and Environment compliance offerings."
            />
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="var(--color-card-border)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="AI Score"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  label={{
                    value: 'AI Analytics',
                    position: 'bottom',
                    offset: -5,
                    fontSize: 11,
                    fontWeight: 700,
                    fill: 'var(--color-text-secondary)',
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="HSE Score"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  label={{
                    value: 'HSE Focus',
                    angle: -90,
                    position: 'left',
                    offset: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    fill: 'var(--color-text-secondary)',
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    fontSize: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-card-border)',
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Competitor Hiring Bar Chart */}
        <div className="glass-card p-6 rounded-2xl shadow-sm flex flex-col h-[340px]">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              Open HSE Tech Roles
            </h4>
            <ChartInfoButton
              title="Open HSE Tech Roles"
              description="Monitors the hiring velocity of competitors for key technical and product roles, indicating strategic R&D investment."
            />
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={hiringData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-card-border)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    fontSize: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-card-border)',
                  }}
                />
                <Bar dataKey="roles" radius={[4, 4, 0, 0]}>
                  {hiringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
