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
export const getLenis = () =>
  lenis || (typeof window !== "undefined" ? (window as any).__lenis : null);

/**
 * Smoothly scrolls to a target element or position
 */
export const smoothScrollTo = (
  target: string | number | HTMLElement,
  options = {},
) => {
  const instance = getLenis();
  if (!instance) {
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

  instance.scrollTo(target, {
    offset: 0,
    immediate: false,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options,
  });
};

/**
 * Runtime tweak of base Lenis options
 */
export function updateLenisOptions(options: any) {
  const instance = getLenis();
  if (instance) {
    Object.assign(instance.options, options);
  }
}

/**
 * Handy preset easings
 */
export const Easings = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  linear: (t: number) => t,
};
