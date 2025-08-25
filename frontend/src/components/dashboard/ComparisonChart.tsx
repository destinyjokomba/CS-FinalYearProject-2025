import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  CartesianGrid,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────
type RegionDatum = {
  party: string;
  share: number;
};

type ComparisonData = {
  userParty: string;
  region: string;
  regionData: RegionDatum[];
};

interface ComparisonChartProps {
  data: ComparisonData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: RegionDatum }[];
  label?: string;
}

// ─── Party Colors ───────────────────────────────────────
const partyColors: Record<string, string> = {
  Labour: "#E4003B",
  Conservative: "#0087DC",
  "Lib Dem": "#FDBB30",
  Green: "#6AB023",
  Reform: "#00BFFF",
  Other: "#888888",
};

// ─── Custom Tooltip ─────────────────────────────────────
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow text-sm">
        <p className="font-semibold">{label}</p>
        <p>
          <span className="font-medium">{entry.value}%</span> support
        </p>
      </div>
    );
  }
  return null;
};

// ─── Chart Component ────────────────────────────────────
const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
    <h3 className="text-lg font-bold mb-4">
      {data.region} Regional Support vs Your Alignment
    </h3>
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data.regionData}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="party" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: "#374151", fontSize: "0.85rem" }}>{value}</span>
          )}
        />

        <Bar
          dataKey="share"
          radius={[10, 10, 0, 0]} 
          animationDuration={1200}
        >
          {data.regionData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={
                entry.party === data.userParty
                  ? partyColors[entry.party] ?? "#E4003B"
                  : (partyColors[entry.party] ?? "#94a3b8") + "90" 
              }
            />
          ))}

          {/* Labels above bars */}
          <LabelList
            dataKey="share"
            position="top"
            content={({ value }) =>
              value !== undefined ? (
                <tspan style={{ fontWeight: "bold", fill: "#374151" }}>{value}%</tspan>
              ) : null
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>

    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
      Highlighted bar = your predicted alignment ({data.userParty})
    </p>
  </div>
);

export default ComparisonChart;
