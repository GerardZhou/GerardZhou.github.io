import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Vite serves index.html first. Its <div id="root"> is the single DOM node
// React owns; everything visible on the portfolio is rendered inside it.
const root = document.getElementById("root");

// Failing loudly makes a broken index.html easy to diagnose instead of showing
// an unexplained blank page.
if (!root) {
  throw new Error("Root element was not found");
}

// StrictMode performs extra development-only checks. It does not render an
// additional copy of the production website.
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
