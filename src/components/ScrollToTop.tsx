import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Prevent browser from restoring scroll position
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Use a small timeout to ensure the DOM is ready and layout is stable
        const timeoutId = setTimeout(() => {
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    const y = element.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for header
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    return;
                }
            }

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
        }, 300); // Increased slightly to ensure cards are rendered

        return () => clearTimeout(timeoutId);
    }, [pathname, hash]);

    return null;
}
