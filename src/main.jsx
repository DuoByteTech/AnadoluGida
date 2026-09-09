import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App.jsx";

import AuthProvider from "@/features/auth/context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            padding: "14px 16px",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4500,
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
