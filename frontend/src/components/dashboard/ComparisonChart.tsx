import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type RegionDatum = { party: string; share: number };

interface Props {
  data: { region: string; regionData: RegionDatum[] };
}

const partyColors: Record<string, string> = {
  lab: "#E4003B",
  con: "#0087DC",
  ld: "#FDBB30",
  green: "#6AB023",
  reform: "#00BFFF",
  snp: "#FFD500",
  other: "#A0AEC0",
};

const ComparisonChart: React.FC<Props> = ({ data }) => {
  if (!data || !data.regionData || data.regionData.length === 0) {
    return <p>No regional data available.</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">Regional Comparison ({data.region})</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.regionData}>
          <XAxis dataKey="party" />
          <YAxis />
          <Tooltip />
          {data.regionData.map((row, idx) => (
            <Bar key={idx} dataKey="share" fill={partyColors[row.party] || "#8884d8"} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
