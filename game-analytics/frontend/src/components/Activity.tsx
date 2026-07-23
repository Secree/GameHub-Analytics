import "../styles/Activity.css";

interface Props {
  title: string;
  subtitle: string;
}

export function Activity({ title, subtitle }: Props) {
  return (
    <div className="activity">
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
  );
}

export default Activity;