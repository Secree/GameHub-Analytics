import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GenreData {
  name: string;
  value: number;
}

interface GenrePieChartProps {
  data: GenreData[];
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#f43f5e",
  "#84cc16",
  "#fb7185",
  "#38bdf8",
];

export default function GenrePieChart({
  data,
}: GenrePieChartProps) {
  return (
    <div className="genre-chart-wrapper">
      
      {/* =========================
          PIE CHART
      ========================= */}

      <div className="genre-pie">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              stroke="#111827"
              strokeWidth={2}
              label={false}
              isAnimationActive={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`genre-${index}`}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              itemStyle={{
                color: "#f8fafc",
              }}
              labelStyle={{
                color: "#22d3ee",
              }}
              formatter={(value, name) => [
                Number(value).toLocaleString(),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>


      {/* =========================
          LEGEND
      ========================= */}

      <div className="genre-legend">
        {data.map((item, index) => (
          <div
            className="genre-legend-item"
            key={`${item.name}-${index}`}
          >
            <span
              className="genre-legend-color"
              style={{
                backgroundColor:
                  COLORS[
                    index % COLORS.length
                  ],
              }}
            />

            <span className="genre-legend-name">
              {item.name}
            </span>

            <span className="genre-legend-value">
              {Number(
                item.value
              ).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}