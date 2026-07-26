import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import type { ChartData } from "../types/dashboard";

interface Props {
  data: ChartData[];
}

const COLORS = [
  "#22d3ee",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
  "#06b6d4",
  "#facc15",
];

export default function GenrePieChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}