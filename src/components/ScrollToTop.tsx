import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Prevent browser from restoring scroll position
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Use a small timeout to ensure the DOM is ready and layout is stable
        const timeoutId = setTimeout(() => {
            if (pathname.includes('/affiliate-portal')) {
                // For affiliate portal, scroll the inner container
                const mainContent = document.getElementById('affiliate-main-content');
                if (mainContent) {
                    mainContent.scrollTo({ top: 0, behavior: 'instant' });
                }
            } else {
                // For other pages, scroll the window
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
