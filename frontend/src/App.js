import React, { useState } from "react";
import Navbar from "./components/navbar";
import Dashboard from "./components/dashboard";
import Analytics from "./components/analytics";
import Result from "./components/result";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Navbar setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="fade-in">
        {page === "home" && <Dashboard />}
        {page === "analytics" && <Analytics />}
        {page === "result" && <Result />}
      </div>

      <footer className="footer">
        © 2026 MindSleep | Sleep-based Depression Risk Monitoring
      </footer>
    </div>
  );
}

export default App;