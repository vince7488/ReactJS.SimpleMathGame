import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/main.less";

const rootElement = document.getElementById("reactMain");

if (!rootElement) {
  throw new Error("Unable to find the React root element.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
