import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { site } from "./data/site";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/* ---------- PWA: register service worker (production, http(s) only) ---------- */
if (import.meta.env.PROD && "serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => { /* offline support unavailable */ });
  });
}

/* ---------- Analytics-ready hook (disabled by default; no invasive tracking) ---------- */
if (site.analytics.enabled && site.analytics.provider === "plausible" && site.analytics.domain) {
  const s = document.createElement("script");
  s.defer = true; s.dataset.domain = site.analytics.domain; s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}
