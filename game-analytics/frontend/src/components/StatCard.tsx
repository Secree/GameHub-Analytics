import "../styles/StatCard.css";

interface Props {
  title: string;
  value: string;
  icon: string;
}

export function StatCard({ title, value, icon }: Props) {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>

      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default StatCard;