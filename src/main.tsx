import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getLenis } from "@/lib/lenis.ts";
 // ✅ Correct import path
import { ContactModalProvider } from "./components/ui/ContactModalContext";

// Initialize Lenis once on app bootstrap
if (typeof window !== "undefined") {
  try {
    getLenis();
  } catch (e) {
    console.warn("[Lenis] init skipped:", e);
  }
}

// ✅ Wrap your App with ContactModalProvider
createRoot(document.getElementById("root")!).render(
  <ContactModalProvider>
    <App />
  </ContactModalProvider>
);


