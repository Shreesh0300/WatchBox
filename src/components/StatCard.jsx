export default function StatCard({ title, value }) {
  return (
    <div className="glass stat-card">
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
    </div>
  );
}
