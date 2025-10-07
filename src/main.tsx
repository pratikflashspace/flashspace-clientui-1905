import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getLenis } from "@/lib/lenis.ts";

// Initialize Lenis once on app bootstrap (safe in dev with HMR guard inside getLenis)
if (typeof window !== 'undefined') {
	try {
		getLenis();
	} catch (e) {
		// swallow – SSR or unexpected environment
		console.warn('[Lenis] init skipped:', e);
    }
}

createRoot(document.getElementById("root")!).render(<App />);
