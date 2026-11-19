import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

function addLink(rel, href, extra = {}) {
  const l = document.createElement("link");
  l.rel = rel; l.href = href;
  Object.entries(extra).forEach(([k, v]) => l.setAttribute(k, v));
  document.head.appendChild(l);
}
addLink("manifest", "/manifest.json");
addLink("icon", "/icon-192.png", { sizes: "192x192", type: "image/png" });
addLink("apple-touch-icon", "/icon-192.png");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
