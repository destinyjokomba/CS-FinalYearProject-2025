import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { partyLabels } from "@/utils/partyMap";
import { Party } from "@/types/dashboard";

const partyColors: Record<Party, string> = {
  lab: "#E4003B",
  con: "#0087DC",
  ld: "#FDBB30",
  green: "#6AB023",
  reform: "#00BFFF",
  snp: "#FFD500",
  other: "#A0AEC0",
};

type RegionDatum = { party: Party; share: number };

interface Props {
  data: { region: string; regionData: RegionDatum[] };
  highlightParty?: Party;
}

const ComparisonChart: React.FC<Props> = ({ data, highlightParty }) => {
  if (!data || !data.regionData || data.regionData.length === 0) {
    return <p>No regional data available.</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">
        Regional Comparison ({data.region})
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.regionData}>
          <XAxis dataKey="party" tickFormatter={(p) => partyLabels[p as Party] || p} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="share" name="Support Share">
            {data.regionData.map((row, idx) => {
              const isHighlight = highlightParty === row.party;
              return (
                <Cell
                  key={idx}
                  fill={partyColors[row.party]}
                  stroke={isHighlight ? "#000" : undefined}
                  strokeWidth={isHighlight ? 2 : 0}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {highlightParty && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Your predicted party (<strong>{partyLabels[highlightParty]}</strong>)
          is highlighted above.
        </p>
      )}
    </div>
  );
};

export default ComparisonChart;
