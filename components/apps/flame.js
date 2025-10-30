// components/apps/flame.js
import React from "react";

const FlameApp = () => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#222" }}>
      <iframe
        src="https://api-sandbox-flame.vercel.app/"
        title="Flame Web App - API Sandbox"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "#fff",
          borderRadius: "8px",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onError={(e) => {
          console.warn('Failed to load API Sandbox:', e);
          // Safely handle error by replacing the iframe with a div instead of using innerHTML
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;font-family:Ubuntu,sans-serif;background:#333;color:#fff;';
          errorDiv.textContent = 'Failed to load API Sandbox';
          e.target.parentNode.replaceChild(errorDiv, e.target);
        }}
      />
    </div>
  );
};

export default FlameApp;