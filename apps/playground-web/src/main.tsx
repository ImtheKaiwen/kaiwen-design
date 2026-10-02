import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, ToastProvider } from "@kaiwen/ui-web";
import "@kaiwen/tokens/tokens.css";
import "@kaiwen/ui-web/styles.css";
import "./index.css";
import { App } from "./App.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <ToastProvider position="bottom-right">
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
