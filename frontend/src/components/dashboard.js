import React, { useState, useEffect } from "react";
import { runPrediction } from "../services/predictionService";

function Dashboard() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);

  const [heartRate, setHeartRate] = useState("--");
  const [spo2, setSpo2] = useState("--");
  const [sleepScore, setSleepScore] = useState("--");

  const [deviceConnected, setDeviceConnected] = useState(false);
  const [battery, setBattery] = useState(100);
  const [sessionData, setSessionData] = useState([]);

  // =========================
  // 🔥 BLUETOOTH CONNECTION
  // =========================
  const connectBluetooth = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: []
      });

      const server = await device.gatt.connect();

      setDeviceConnected(true);
      console.log("Connected:", device.name);

      // Auto disconnect detect
      device.addEventListener("gattserverdisconnected", () => {
        setDeviceConnected(false);
      });

      // OPTIONAL: Read heart rate (real device)
      try {
        const service = await server.getPrimaryService("heart_rate");
        const characteristic = await service.getCharacteristic("heart_rate_measurement");

        await characteristic.startNotifications();

        characteristic.addEventListener("characteristicvaluechanged", (event) => {
          const value = event.target.value;
          const hr = value.getUint8(1);
          setHeartRate(hr);
        });
      } catch {
        console.log("Heart rate service not available");
      }

    } catch (err) {
      console.log("Bluetooth Error:", err);
      setDeviceConnected(false);
    }
  };

  // =========================
  // SLEEP SCORE LOGIC
  // =========================
  function calculateSleepScore(hr, spo2, movement, sleep_hours) {
    let score = 100;

    if (sleep_hours < 5) score -= 25;
    else if (sleep_hours < 6) score -= 15;

    if (hr > 85) score -= 15;
    else if (hr > 75) score -= 5;

    if (spo2 < 94) score -= 20;
    else if (spo2 < 96) score -= 10;

    if (movement > 40) score -= 20;
    else if (movement > 25) score -= 10;

    return Math.max(score, 0);
  }

  function getSleepLevel(score) {
    if (score < 50) return "Poor";
    if (score < 75) return "Average";
    return "Good";
  }

  // =========================
  // TIMER + DATA RECORD
  // =========================
  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);

        const hr = 70 + Math.floor(Math.random() * 10);
        const sp = 95 + Math.floor(Math.random() * 5);
        const movement = Math.floor(Math.random() * 50);

        const score = calculateSleepScore(
          hr,
          sp,
          movement,
          (time + 1) / 3600
        );

        setHeartRate(hr);
        setSpo2(sp);
        setSleepScore(score);

        setBattery(prev => (prev > 0 ? prev - 0.02 : 0));

        setSessionData(prev => [
          ...prev,
          {
            heart_rate: hr,
            spo2: sp,
            movement: movement,
            sleep_score: score,
            time: Date.now()
          }
        ]);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, time]);

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = () => {
    const h = String(Math.floor(time / 3600)).padStart(2, "0");
    const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // =========================
  // STOP FUNCTION
  // =========================
  const handleStop = async () => {
    setRunning(false);

    if (sessionData.length === 0) return;

    const avg = key =>
      sessionData.reduce((a, b) => a + b[key], 0) / sessionData.length;

    const finalData = {
      sleep_hours: time / 3600,
      heart_rate: avg("heart_rate"),
      spo2: avg("spo2"),
      movement: avg("movement"),
      sleep_score: avg("sleep_score")
    };

    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({
      date: new Date().toLocaleDateString(),
      ...finalData
    });
    localStorage.setItem("history", JSON.stringify(history));

    localStorage.setItem("lastSession", JSON.stringify(sessionData));

    try {
      const result = await runPrediction(finalData);
      localStorage.setItem("result", JSON.stringify(result));
      alert("Prediction Done ✅");
    } catch {
      alert("Server Error ❌");
    }
  };

  return (
    <div className="container">

      <div className="top-bar">
        <div className={deviceConnected ? "device on" : "device off"}>
          {deviceConnected ? "🟢 Device Connected" : "🔴 Device Not Connected"}
        </div>

        <div className="battery">
          🔋 {Math.floor(battery)}%
        </div>
      </div>

      <h1>Welcome to MindSleep</h1>
      <p>Track your sleep. Protect your mental health.</p>

      <div className="buttons">
        <button
          className="start"
          onClick={async () => {
            await connectBluetooth(); // 🔥 important
            setRunning(true);
            setSessionData([]);
            setTime(0);
          }}
        >
          Start Sleep
        </button>

        <button className="stop" onClick={handleStop}>
          End Sleep
        </button>
      </div>

      <p>Status: {running ? "Running" : "Idle"}</p>
      <h3>{formatTime()}</h3>

      <div className="cards">

        <div className="card">
          <h4>Sleep Duration</h4>
          <p>{formatTime()}</p>
        </div>

        <div className="card">
          <h4>Sleep Quality</h4>
          <p>{running ? getSleepLevel(sleepScore) : "--"}</p>
        </div>

        <div className="card">
          <h4>Sleep Score</h4>
          <p>{sleepScore}</p>
        </div>

        <div className="card">
          <h4>Heart Rate</h4>
          <p>{heartRate}</p>
        </div>

        <div className="card">
          <h4>SpO₂</h4>
          <p>{spo2}</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;