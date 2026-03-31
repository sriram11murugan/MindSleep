import React from "react";

function Result() {
  return (
    <div className="container">
      <div className="result normal">
        <h2>🟢 Status: Normal</h2>
        <p>Your sleep pattern does not show strong depression indicators.</p>
      </div>

      <p className="note">
        ⚠ This is not a medical diagnosis.
      </p>
    </div>
  );
}

export default Result;