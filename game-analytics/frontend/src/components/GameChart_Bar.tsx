import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TagData {
  name: string;
  value: number;
}

interface TagBarChartProps {
  data: TagData[];
}

export default function TagBarChart({
  data,
}: TagBarChartProps) {
  return (
    <div className="responsive-chart bar-chart">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 90,
          }}
        >
          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
          />

          <YAxis
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            labelStyle={{
              color: "#22d3ee",
            }}
            itemStyle={{
              color: "#f8fafc",
            }}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Games",
            ]}
          />

          <Bar
            dataKey="value"
            name="Games"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}