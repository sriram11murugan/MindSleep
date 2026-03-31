import React from "react";
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
  const sleepData = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [
      {
        label: "Sleep Hours",
        data: [6,7,8,6.5,7.5,8,7],
        backgroundColor: "#6366f1",
      },
    ],
  };

  const movementData = {
    labels: ["12AM","2AM","4AM","6AM"],
    datasets: [
      {
        label: "Movement Level",
        data: [20,45,30,15],
        borderColor: "#22c55e",
        fill: false,
      },
    ],
  };

  return (
    <div className="container">
      <h1>Sleep Analytics</h1>

      <div className="chart-card">
        <h3>Weekly Sleep Duration</h3>
        <Bar data={sleepData} />
      </div>

      <div className="chart-card">
        <h3>Night Movement Pattern</h3>
        <Line data={movementData} />
      </div>
    </div>
  );
}

export default Analytics;