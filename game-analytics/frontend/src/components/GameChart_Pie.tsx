import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    genre: "Action",
    games: 45,
  },
  {
    genre: "RPG",
    games: 25,
  },
  {
    genre: "Strategy",
    games: 15,
  },
  {
    genre: "Simulation",
    games: 10,
  },
  {
    genre: "Indie",
    games: 5,
  },
];

const COLORS = [
  "#22d3ee",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
];

const GameChart_Pie = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="games"
          nameKey="genre"
          cx="50%"
          cy="50%"
          outerRadius={110}
          innerRadius={55}
          paddingAngle={3}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          height={36}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GameChart_Pie;