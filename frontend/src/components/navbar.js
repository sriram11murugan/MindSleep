import React, { useState } from "react";
import logo from "../assets/mindsleep-logo.jpg";

function Navbar({ setPage, darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="logo" />
        <span>MindSleep</span>
      </div>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span><span></span><span></span>
      </div>

      <div className={open ? "menu open" : "menu"}>
        <button onClick={() => { setPage("home"); setOpen(false); }}>
          Home
        </button>
        <button onClick={() => { setPage("analytics"); setOpen(false); }}>
          Analytics
        </button>
        <button onClick={() => { setPage("result"); setOpen(false); }}>
          Result
        </button>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;