import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function Analytics() {

  const [sleepData, setSleepData] = useState(null);
  const [movementData, setMovementData] = useState(null);
  const [started, setStarted] = useState(false);

  // =========================
  // 🔄 LIVE DATA FETCH
  // =========================
  useEffect(() => {

    const interval = setInterval(() => {

      try {
        const session = JSON.parse(localStorage.getItem("liveSession"));

        // ❌ No session → don't show charts
        if (!session || session.length === 0) {
          setStarted(false);
          setSleepData(null);
          setMovementData(null);
          return;
        }

        // ✅ Session active
        setStarted(true);

        const labels = session.map((_, i) => `${i + 1}s`);

        const heartRates = session.map(d => d.heart_rate || 0);
        const movements = session.map(d => d.movement || 0);

        // =========================
        // 📊 HEART RATE CHART
        // =========================
        setSleepData({
          labels,
          datasets: [
            {
              label: "Heart Rate (BPM)",
              data: heartRates,
              backgroundColor: "#6366f1",
            },
          ],
        });

        // =========================
        // 📈 MOVEMENT CHART
        // =========================
        setMovementData({
          labels,
          datasets: [
            {
              label: "Movement Level",
              data: movements,
              borderColor: "#22c55e",
              backgroundColor: "#22c55e33",
              fill: true,
              tension: 0.3,
            },
          ],
        });

      } catch (err) {
        console.log("Analytics Error:", err);
        setStarted(false);
      }

    }, 1000); // 🔥 update every second

    return () => clearInterval(interval);

  }, []);

  // =========================
  // UI
  // =========================
  return (
    <div className="container">

      <h1>Sleep Analytics (Live)</h1>

      {!started ? (
        <div className="card">
          <p>⚠ No active sleep session</p>
          <p>👉 Go to Home and click "Start Sleep"</p>
        </div>
      ) : (
        <>
          <div className="chart-card">
            <h3>❤️ Heart Rate (Live)</h3>
            <Bar data={sleepData} />
          </div>

          <div className="chart-card">
            <h3>🏃 Movement Pattern (Live)</h3>
            <Line data={movementData} />
          </div>
        </>
      )}

    </div>
  );
}

export default Analytics;
