import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { party: "Labour", shortLabel: "Lab", value: 30.0, color: "#E4003B" },
  { party: "Conservatives", shortLabel: "Con", value: 17.8, color: "#0087DC" },
  { party: "Green", shortLabel: "Green", value: 8.9, color: "#6AB023" },
  { party: "Lib Dems", shortLabel: "LD", value: 14.5, color: "#FDBB30" },
  { party: "Reform UK", shortLabel: "Reform", value: 22.5, color: "#12B6CF" },
  { party: "SNP", shortLabel: "SNP", value: 2.6, color: "#FDF38E" },
  { party: "Other", shortLabel: "Other", value: 3.6, color: "#999999" },
];

const NationalPredictionCard: React.FC = () => {
  const winner = chartData.reduce((a, b) => (a.value > b.value ? a : b));

  return (
    <Card>
      <CardHeader>
        <CardTitle>National Prediction</CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on real sample data (updated 18/08/2025, 19:47:06)
        </p>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              type="category"
              dataKey="shortLabel"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip formatter={(val: number) => `${val}%`} />
            <Bar dataKey="value">
              <LabelList
                dataKey="value"
                position="top"
                content={({ value }) => (value != null ? `${value}%` : "")}
              />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Winner */}
        <p className="mt-4 text-sm font-medium">
          🏆 Predicted Winner:{" "}
          <span style={{ color: winner.color }}>{winner.party}</span>
        </p>

        {/* Table */}
        <div className="mt-4">
          <table className="w-full text-sm border-t">
            <thead>
              <tr>
                <th className="text-left py-1">Party</th>
                <th className="text-right py-1">Share</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((entry) => (
                <tr
                  key={entry.party}
                  className={
                    entry.party === winner.party ? "font-semibold" : ""
                  }
                >
                  <td className="py-1" style={{ color: entry.color }}>
                    {entry.party}
                  </td>
                  <td className="text-right py-1">{entry.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>__
        </div>
      </CardContent>
    </Card>
  );
};

export default NationalPredictionCard;
