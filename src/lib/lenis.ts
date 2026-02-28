import Lenis from "lenis";

let lenis: Lenis | null = null;

/**
 * Initializes Lenis for smooth scrolling
 */
export const initLenis = () => {
  if (typeof window === "undefined") return;

  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Global access for debugging or manual control
  (window as any).__lenis = lenis;

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
};

/**
 * Gets the global Lenis instance
 */
export const getLenis = () => lenis;

/**
 * Smoothly scrolls to a target element or position
 */
export const smoothScrollTo = (
  target: string | number | HTMLElement,
  options = {},
) => {
  if (!lenis) {
    // Fallback to native smooth scroll if Lenis is not initialized
    if (typeof target === "string") {
      const element = document.querySelector(target);
      element?.scrollIntoView({ behavior: "smooth" });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  lenis.scrollTo(target, {
    offset: 0,
    immediate: false,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options,
  });
};
