import "../styles/Dashboard.css";
import StatCard from "../components/StatCard";
import Activity from "../components/Activity";

export function Dashboard() {
  return (
    <div className="dashboard">
      <section className="hero">
        <h1>🎮 Steam Analytics Dashboard</h1>
        <p>
          Analyze Steam games, player trends, pricing, reviews, and market
          insights.
        </p>
      </section>

      <main className="dashboard-content">
        {/* Statistics */}
        <section className="stats-grid">
          <StatCard title="Games Tracked" value="93,421" icon="🎮" />
          <StatCard title="Active Players" value="21.3M" icon="👥" />
          <StatCard title="Average Rating" value="87%" icon="⭐" />
          <StatCard title="Average Price" value="$19.73" icon="💲" />
        </section>

        {/* Charts */}
        <section className="chart-grid">
          <div className="chart large">
            <h2>Player Growth</h2>
            <div className="chart-placeholder">📈 Chart Here</div>
          </div>

          <div className="chart">
            <h2>Genre Distribution</h2>
            <div className="chart-placeholder">🥧 Pie Chart</div>
          </div>
        </section>

        {/* Bottom */}
        <section className="bottom-grid">
          <div className="panel">
            <h2>🔥 Trending Games</h2>

            <table>
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Players</th>
                  <th>Rating</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Counter-Strike 2</td>
                  <td>1,320,000</td>
                  <td>95%</td>
                </tr>

                <tr>
                  <td>Dota 2</td>
                  <td>720,000</td>
                  <td>90%</td>
                </tr>

                <tr>
                  <td>Rust</td>
                  <td>185,000</td>
                  <td>88%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>📢 Recent Activity</h2>

            <Activity
              title="Steam API Updated"
              subtitle="5 minutes ago"
            />

            <Activity
              title="Player count refreshed"
              subtitle="1 hour ago"
            />

            <Activity
              title="Price history imported"
              subtitle="Today"
            />
          </div>
        </section>
      </main>
    </div>
  );
}