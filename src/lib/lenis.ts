import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const initLenis = () => {
    if (typeof window === 'undefined') return null;

    if (!lenisInstance) {
        lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        (window as any).__lenis = lenisInstance;

        function raf(time: number) {
            lenisInstance?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    return lenisInstance;
};

export const getLenis = () => {
    if (!lenisInstance && typeof window !== 'undefined') {
        return (window as any).__lenis || initLenis();
    }
    return lenisInstance;
};

export const smoothScrollTo = (target: string | number | HTMLElement, options = {}) => {
    const lenis = getLenis();
    if (lenis) {
        lenis.scrollTo(target, options);
    } else {
        // Fallback to native scroll if Lenis is not available
        if (typeof target === 'string') {
            const el = document.querySelector(target);
            el?.scrollIntoView({ behavior: 'smooth' });
        } else if (typeof target === 'number') {
            window.scrollTo({ top: target, behavior: 'smooth' });
        } else if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
};