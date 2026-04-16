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

  const [showHistory, setShowHistory] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const [movementData, setMovementData] = useState({
    labels: [],
    datasets: []
  });

  const [sleepStageData, setSleepStageData] = useState({
    labels: [],
    datasets: []
  });

  // =========================
  // 📊 WEEKLY DATA
  // =========================
  const weeklyData = {
    labels: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    datasets: [
      {
        label: "Sleep Hours",
        data: [10, 6, 0, 0, 0, 0, 0],
        backgroundColor: [
          "#06b6d4",
          "#f97316",
          "#3b82f6",
          "#e5e7eb",
          "#e5e7eb",
          "#e5e7eb",
          "#e5e7eb"
        ],
        borderRadius: 10
      }
    ]
  };

  // =========================
  // 📜 HISTORY DATA
  // =========================
  const historyData = [
    {
      day: "Monday",
      sleep_hours: 10,
      heart_rate: 70,
      spo2: 98,
      movement: 18,
      sleep_score: 85,
      deep_sleep_hours: "2h 30m",
      deep_sleep_time: "1:00 AM - 3:30 AM"
    },
    {
      day: "Tuesday",
      sleep_hours: 6,
      heart_rate: 82,
      spo2: 96,
      movement: 35,
      sleep_score: 65,
      deep_sleep_hours: "1h 10m",
      deep_sleep_time: "2:00 AM - 3:10 AM"
    }
  ];

  const barOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.raw + " hrs sleep"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 12
      }
    }
  };

  // =========================
  // 🌙 CONTROLLED LIVE DATA
  // =========================
  useEffect(() => {

    let fakeData = [];

    const interval = setInterval(() => {

      const isSleeping = localStorage.getItem("isSleeping");

      // ❌ Not started
      if (isSleeping !== "true") {
        setMovementData({ labels: [], datasets: [] });
        setSleepStageData({ labels: [], datasets: [] });
        return;
      }

      // ✅ Start live simulation
      const movement = Math.floor(Math.random() * 50) + 10;
      const hr = Math.floor(Math.random() * 20) + 65;

      fakeData.push({
        movement,
        heart_rate: hr
      });

      const labels = fakeData.map((_, i) => `${i + 1}s`);
      const movements = fakeData.map(d => d.movement);

      setMovementData({
        labels,
        datasets: [
          {
            label: "Night Movement",
            data: movements,
            borderColor: "#22c55e",
            fill: true,
          },
        ],
      });

      const stages = fakeData.map(d => {
        if (d.movement < 20 && d.heart_rate < 75) return 2;
        if (d.movement < 40) return 1;
        return 0;
      });

      setSleepStageData({
        labels,
        datasets: [
          {
            label: "Sleep Stage",
            data: stages,
            borderColor: "#8b5cf6",
            fill: true,
          },
        ],
      });

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  const sleepOptions = {
    scales: {
      y: {
        min: 0,
        max: 2,
        ticks: {
          callback: (v) =>
            v === 2 ? "Deep" : v === 1 ? "Light" : "Awake"
        }
      }
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="container">

      <h1>Sleep Analytics</h1>

      <button
        onClick={() => {
          setShowHistory(!showHistory);
          setSelectedDay(null);
        }}
        style={{
          marginBottom: "15px",
          padding: "10px",
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "10px"
        }}
      >
        {showHistory ? "Show Weekly" : "Show History"}
      </button>

      {/* WEEKLY */}
      {!showHistory && (
        <div className="chart-card">
          <h3>Weekly Sleep</h3>
          <Bar data={weeklyData} options={barOptions} />
        </div>
      )}

      {/* HISTORY */}
      {showHistory && (
        <>
          <div className="cards">
            {historyData.map((d, i) => (
              <div
                key={i}
                className="card"
                onClick={() => setSelectedDay(d)}
                style={{ cursor: "pointer" }}
              >
                <h3>{d.day}</h3>
                <p>{d.sleep_hours} hrs</p>
              </div>
            ))}
          </div>

          {selectedDay && (
            <div className="chart-card">
              <h2>{selectedDay.day} Analysis</h2>

              <p>Sleep Duration: {selectedDay.sleep_hours} hrs</p>
              <p>Deep Sleep: {selectedDay.deep_sleep_hours}</p>
              <p>Time: {selectedDay.deep_sleep_time}</p>
              <p>Movement: {selectedDay.movement}</p>
              <p>Sleep Score: {selectedDay.sleep_score}</p>
              <p>Heart Rate: {selectedDay.heart_rate} bpm</p>
              <p>SpO₂: {selectedDay.spo2}%</p>

              <p>
                Overall:
                {selectedDay.sleep_score > 75
                  ? " 🟢 Good"
                  : selectedDay.sleep_score > 60
                  ? " 🟡 Average"
                  : " 🔴 Poor"}
              </p>

              <button className="close-btn" onClick={() => setSelectedDay(null)}>
                Close
              </button>
            </div>
          )}
        </>
      )}

      {/* LIVE */}
      {movementData.labels.length === 0 ? (
        <div className="card">
          <p>⚠ Start sleep session to view live data</p>
        </div>
      ) : (
        <>
          <div className="chart-card">
            <h3>Night Movement</h3>
            <Line data={movementData} />
          </div>

          <div className="chart-card">
            <h3>Sleep Stages</h3>
            <Line data={sleepStageData} options={sleepOptions} />
          </div>
        </>
      )}

    </div>
  );
}

export default Analytics; 
