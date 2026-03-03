import Lenis from 'lenis';

let cached: Lenis | undefined;

export function getLenis(): Lenis {
  if (typeof window === 'undefined') {
    throw new Error('Lenis can only be used in the browser');
  }
  if (window.__lenis) return window.__lenis;
  if (!cached) {
    cached = new Lenis({
      // Tweak values to taste
      duration: 1.1, // approx seconds to reach target (affects ease feel)
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // cubic out
      smoothWheel: true,
      touchMultiplier: 1.5,
      autoRaf: false, // we'll drive rAF manually for flexibility
    });
    window.__lenis = cached;
    // rAF loop (single instance)
    const raf = (time: number) => {
      cached?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  return cached;
}

// Optional helper to scroll taking header offset into account
export interface SmoothScrollOpts {
  offset?: number;
  immediate?: boolean;
  duration?: number; // override default duration for this scroll only
  easing?: (t: number) => number; // per-call easing
  lock?: boolean; // prevent user interaction while animating
  force?: boolean; // force even if already at position
}

export function smoothScrollTo(target: string | HTMLElement, opts?: SmoothScrollOpts) {
  const lenis = getLenis();
  const offset = opts?.offset ?? -80; // negative pulls content below fixed header
  if (typeof target === 'string') {
    if (target.startsWith('#')) {
      const el = document.querySelector(target) as HTMLElement | null;
      if (el) {
        lenis.scrollTo(el, { offset, immediate: opts?.immediate, duration: opts?.duration, easing: opts?.easing, lock: opts?.lock, force: opts?.force });
      }
    } else {
      // if it's not a hash we can't use lenis directly
      const el = document.querySelector(target) as HTMLElement | null;
      if (el) lenis.scrollTo(el, { offset, immediate: opts?.immediate, duration: opts?.duration, easing: opts?.easing, lock: opts?.lock, force: opts?.force });
    }
  } else {
    lenis.scrollTo(target, { offset, immediate: opts?.immediate, duration: opts?.duration, easing: opts?.easing, lock: opts?.lock, force: opts?.force });
  }
}

// Runtime tweak of base Lenis options (e.g., change global duration/easing). Only merges known numeric/function props.
export function updateLenisOptions(options: Partial<{ duration: number; easing: (t: number) => number; touchMultiplier: number; wheelMultiplier: number }>) {
  const lenis = getLenis();
  Object.assign(lenis.options, options);
}

// Handy preset easings you can import
export const Easings = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  linear: (t: number) => t,
};
