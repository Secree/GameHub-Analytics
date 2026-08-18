import "../styles/Trends.css";

import {
  useEffect,
  useState,
} from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  getPlayerActivity,
  getTopTrendGames,
  getReviewTrends,
  getPriceTrends,
  type PlayerActivity,
  type TopGame,
  type ReviewTrend,
  type PriceTrend,
} from "../services/trends";


const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
];


export function Trends() {

  const [
    playerActivity,
    setPlayerActivity,
  ] = useState<PlayerActivity[]>([]);

  const [
    topGames,
    setTopGames,
  ] = useState<TopGame[]>([]);

  const [
    reviews,
    setReviews,
  ] = useState<ReviewTrend | null>(null);

  const [
    prices,
    setPrices,
  ] = useState<PriceTrend[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {

    async function loadTrends() {

      try {

        setLoading(true);
        setError("");

        const [
          activityData,
          topGameData,
          reviewData,
          priceData,
        ] = await Promise.all([

          getPlayerActivity(),

          getTopTrendGames(10),

          getReviewTrends(),

          getPriceTrends(),

        ]);


        setPlayerActivity(
          activityData
        );

        setTopGames(
          topGameData
        );

        setReviews(
          reviewData
        );

        setPrices(
          priceData
        );

      } catch (err) {

        console.error(
          "Failed to load trends:",
          err
        );

        setError(
          "Failed to load trends data."
        );

      } finally {

        setLoading(false);

      }

    }

    loadTrends();

  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="trends-page">

        <div className="trends-loading">
          Loading trends...
        </div>

      </div>
    );

  }


  // ==========================================================
  // REVIEW CALCULATIONS
  // ==========================================================

  const positive =
    reviews?.positive ?? 0;

  const negative =
    reviews?.negative ?? 0;

  const totalReviews =
    positive + negative;

  const positiveRate =
    totalReviews > 0
      ? (
          positive /
          totalReviews *
          100
        ).toFixed(1)
      : "0.0";


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="trends-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="trends-header">

        <h1>
          📈 Trends
        </h1>

        <p>
          Explore player activity, popular games,
          reviews and pricing trends across the
          GameHub database.
        </p>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="trends-error">
          {error}
        </div>

      )}


      <main className="trends-content">


        {/* ===================================================
            PLAYER ACTIVITY
        =================================================== */}

        <section className="trend-card large">

          <div className="trend-header">

            <div>

              <h2>
                Player Activity
              </h2>

              <p>
                Total recorded players over time
              </p>

            </div>

          </div>


          {playerActivity.length > 0 ? (

            <div className="trend-chart">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={playerActivity}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#94a3b8",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "8px",
                      color:
                        "#f8fafc",
                    }}
                    formatter={(
                      value
                    ) => [
                      Number(
                        value
                      ).toLocaleString(),
                      "Players",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="players"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="no-trend-data">
              No player history available.
            </div>

          )}

        </section>


        {/* ===================================================
            TOP GAMES
        =================================================== */}

        <section className="trend-card">

          <div className="trend-header">

            <div>

              <h2>
                🔥 Top Games
              </h2>

              <p>
                Games with the highest recorded
                current player counts
              </p>

            </div>

          </div>


          {topGames.length > 0 ? (

            <div className="trend-chart">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={topGames}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    tick={{
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{
                      fill: "#e2e8f0",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "8px",
                    }}
                    formatter={(
                      value
                    ) => [
                      Number(
                        value
                      ).toLocaleString(),
                      "Players",
                    ]}
                  />

                  <Bar
                    dataKey="players"
                    fill="#8b5cf6"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="no-trend-data">
              No player data available.
            </div>

          )}

        </section>


        {/* ===================================================
            REVIEW SENTIMENT
        =================================================== */}

        <section className="trend-card">

          <div className="trend-header">

            <div>

              <h2>
                ⭐ Review Sentiment
              </h2>

              <p>
                Overall positive vs negative reviews
              </p>

            </div>

          </div>


          {totalReviews > 0 ? (

            <div className="review-trend-layout">

              <div className="review-pie">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={[
                        {
                          name: "Positive",
                          value: positive,
                        },
                        {
                          name: "Negative",
                          value: negative,
                        },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                    >

                      <Cell
                        fill="#22c55e"
                      />

                      <Cell
                        fill="#ef4444"
                      />

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>


              <div className="review-summary">

                <div className="trend-stat">

                  <span>
                    Positive
                  </span>

                  <strong>
                    {positive.toLocaleString()}
                  </strong>

                </div>


                <div className="trend-stat">

                  <span>
                    Negative
                  </span>

                  <strong>
                    {negative.toLocaleString()}
                  </strong>

                </div>


                <div className="trend-stat highlight">

                  <span>
                    Positive Rate
                  </span>

                  <strong>
                    {positiveRate}%
                  </strong>

                </div>

              </div>

            </div>

          ) : (

            <div className="no-trend-data">
              No review data available.
            </div>

          )}

        </section>


        {/* ===================================================
            PRICE DISTRIBUTION
        =================================================== */}

        <section className="trend-card">

          <div className="trend-header">

            <div>

              <h2>
                💲 Price Distribution
              </h2>

              <p>
                Number of games by current price range
              </p>

            </div>

          </div>


          {prices.length > 0 ? (

            <div className="trend-chart">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={prices}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#94a3b8",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "8px",
                    }}
                    formatter={(
                      value
                    ) => [
                      Number(
                        value
                      ).toLocaleString(),
                      "Games",
                    ]}
                  />

                  <Bar
                    dataKey="value"
                    fill="#14b8a6"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="no-trend-data">
              No price data available.
            </div>

          )}

        </section>


      </main>

    </div>

  );
}