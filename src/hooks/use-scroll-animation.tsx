import { useEffect, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (
  elementId: string,
  options: UseScrollAnimationOptions = {},
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold, rootMargin },
    );

    const element = document.getElementById(elementId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementId, threshold, rootMargin, triggerOnce, hasTriggered]);

  return isVisible;
};

// Animation utility classes
export const getAnimationClasses = (
  isVisible: boolean,
  animationType:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "fadeInUp" = "fadeIn",
  delay: number = 0,
) => {
  const baseClasses = "transition-all duration-700 ease-out";
  const delayStyle = delay > 0 ? { transitionDelay: `${delay}ms` } : {};

  const animations = {
    fadeIn: isVisible
      ? `opacity-100 translate-y-0 ${baseClasses}`
      : `opacity-0 translate-y-4 ${baseClasses}`,
    slideUp: isVisible
      ? `opacity-100 translate-y-0 ${baseClasses}`
      : `opacity-0 translate-y-12 ${baseClasses}`,
    slideLeft: isVisible
      ? `opacity-100 translate-x-0 ${baseClasses}`
      : `opacity-0 translate-x-12 ${baseClasses}`,
    slideRight: isVisible
      ? `opacity-100 translate-x-0 ${baseClasses}`
      : `opacity-0 -translate-x-12 ${baseClasses}`,
    scale: isVisible
      ? `opacity-100 scale-100 ${baseClasses}`
      : `opacity-0 scale-95 ${baseClasses}`,
    fadeInUp: isVisible
      ? `opacity-100 translate-y-0 ${baseClasses}`
      : `opacity-0 translate-y-8 ${baseClasses}`,
  };

  return { className: animations[animationType], style: delayStyle };
};
