// components/apps/flame.js
import React from "react";

const FlameApp = () => (
  <div style={{ width: "100%", height: "100%", background: "#222" }}>
    <iframe
      src="https://api-sandbox-flame.vercel.app/"
      title="Flame Web App"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        background: "#fff",
        borderRadius: "8px",
      }}
      allowFullScreen
    />
  </div>
);

export default FlameApp;