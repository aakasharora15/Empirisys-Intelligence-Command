"use client";

import {
  ResponsiveContainer, ScatterChart, Scatter,
  XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Cell,
} from 'recharts';

interface BubbleDataPoint {
  name: string;
  x: number;
  y: number;
  z: number;
  fill: string;
}

interface Props {
  data: BubbleDataPoint[];
  onTopicClick: (name: string) => void;
}

export default function ThoughtLeadershipBubbleChart({ data, onTopicClick }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
        <CartesianGrid stroke="var(--color-card-border)" />
        <XAxis
          type="number"
          dataKey="x"
          name="Trend Score"
          domain={[50, 100]}
          tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
          label={{ value: 'Trend Momentum', position: 'bottom', offset: 0, fontSize: 11, fontWeight: 700, fill: 'var(--color-text-secondary)' }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Relevance Score"
          domain={[50, 100]}
          tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
          label={{ value: 'Empirisys Relevance', angle: -90, position: 'left', offset: 10, fontSize: 11, fontWeight: 700, fill: 'var(--color-text-secondary)' }}
        />
        <ZAxis type="number" dataKey="z" range={[100, 800]} />
        <RechartsTooltip
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ fontSize: '10px', borderRadius: '8px', border: '1px solid var(--color-card-border)' }}
        />
        <Scatter
          data={data}
          onClick={(node: { name?: string; payload?: { name?: string } }) =>
            onTopicClick(node.name || node.payload?.name || '')
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} className="cursor-pointer" />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
