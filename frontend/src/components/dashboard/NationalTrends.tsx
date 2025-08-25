// src/components/dashboard/NationalTrends.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

// Data
const nationalTrendData = [
  { date: "Jul", Labour: 40, Conservative: 32, LibDem: 15, Green: 6, Reform: 20, Other: 3 },
  { date: "Aug", Labour: 25, Conservative: 31, LibDem: 14, Green: 8, Reform: 35, Other: 1 },
  { date: "Sep", Labour: 30, Conservative: 30, LibDem: 13, Green: 9, Reform: 38, Other: 3 },
  { date: "Oct", Labour: 42, Conservative: 32, LibDem: 12, Green: 12, Reform: 28, Other: 6 },
];

// Party colors
const partyColors: Record<string, string> = {
  Labour: "#E4003B",
  Conservative: "#0087DC",
  LibDem: "#FDBB30",
  Green: "#6AB023",
  Reform: "#00BFFF",
  Other: "#A0AEC0", 
};

interface TrendEntry {
  name: string;
  value: number;
  color: string;
}

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = (props) => {
  const { active, payload, label } = props as {
    active?: boolean;
    payload?: TrendEntry[];
    label?: string;
  };

  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-700 p-3 rounded shadow text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: partyColors[entry.name] }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const NationalTrends: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">National Trends Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={nationalTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 60]} tickFormatter={(val) => `${val}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {Object.keys(partyColors).map((party) => (
            <Line
              key={party}
              type="monotone"
              dataKey={party}
              stroke={partyColors[party]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              strokeDasharray={party === "Other" ? "5 5" : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NationalTrends;
