import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@kaiwen/ui-web";
import "@kaiwen/tokens/tokens.css";
import "@kaiwen/ui-web/styles.css";
import "./index.css";
import { App } from "./App.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
