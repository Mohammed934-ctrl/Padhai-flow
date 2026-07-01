import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <BrowserRouter>
    <AuthProvider>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          <App />
        </TooltipProvider>
    </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
);
