import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.tsx";
import "./index.css";
import { ContactModalProvider } from "./components/ui/ContactModalContext";
import { DarkModeProvider } from "./contexts/DarkModeContext.tsx";


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');
}

// Wrap your App with Google OAuth and ContactModal providers
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ContactModalProvider>

      {/* Wrap up App by dark mode provider */}
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </ContactModalProvider>
  </GoogleOAuthProvider>
);


