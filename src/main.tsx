import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.tsx";
import "./index.css";
import { getLenis } from "@/lib/lenis.ts";
import { ContactModalProvider } from "./components/ui/ContactModalContext";

// Initialize Lenis once on app bootstrap
if (typeof window !== "undefined") {
  try {
    getLenis();
  } catch (e) {
    console.warn("[Lenis] init skipped:", e);
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');
}

// Wrap your App with Google OAuth and ContactModal providers
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ContactModalProvider>
      <App />
    </ContactModalProvider>
  </GoogleOAuthProvider>
);


