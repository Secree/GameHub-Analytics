import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartData } from "../types/dashboard";

interface Props {
  data: ChartData[];
}

export default function TagBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="name"
          angle={-35}
          textAnchor="end"
          interval={0}
          height={90}
        />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="value"
          fill="#22d3ee"
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}