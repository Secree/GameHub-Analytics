import "../styles/Dashboard.css";
import StatCard from "../components/StatCard";
import Activity from "../components/Activity";

export function Dashboard() {
  return (
    <div className="dashboard">
      <section className="hero">
        <h1>🎮 Game Analytics Dashboard</h1>
        <p>
          Analyze game data, player trends, pricing, reviews, and market
          insights.
        </p>
      </section>

      <main className="dashboard-content">
        {/* Statistics */}
        <section className="stats-grid">
          <StatCard title="Games Tracked" value="0" icon="🎮" />
          <StatCard title="Active Players" value="0" icon="👥" />
          <StatCard title="Average Rating" value="0%" icon="⭐" />
          <StatCard title="Average Price" value="$0.00" icon="💲" />
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
                  <td>Game 1</td>
                  <td>1,320,000</td>
                  <td>95%</td>
                </tr>

                <tr>
                  <td>Game 2</td>
                  <td>720,000</td>
                  <td>90%</td>
                </tr>

                <tr>
                  <td>Game 3</td>
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