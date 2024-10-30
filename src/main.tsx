import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AuthProvider } from "./hooks/AuthProvider";
import { ThemeProvider } from "./components/Theme-provider";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { ModeToggle } from "./components/mode-toggle";
import { Layout } from "./components/ui/Layout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <ToastContainer theme="dark" position="bottom-left" autoClose={3000} />
        <div className="w-full flex justify-end">
          <ModeToggle />
        </div>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Layout>
    </ThemeProvider>
  </StrictMode>
);
