import "../styles/StatCard.css";

interface Props {
  title: string;
  value: string;
}

export function StatCard({ title, value }: Props) {
  return (
    <div className="stat-card">

      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default StatCard;