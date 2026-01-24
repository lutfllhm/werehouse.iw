import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for lazy loading animations using Intersection Observer
 * Only triggers animations when element is visible in viewport
 * 
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Percentage of element visibility (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once
 * @returns {Object} - { ref, isVisible }
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Remove will-change after animation completes for better performance
          setTimeout(() => {
            if (element) {
              element.classList.add('animation-complete');
            }
          }, 1000);

          // Disconnect observer if triggerOnce is true
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

/**
 * Hook for batch observing multiple elements
 * Useful for animating lists or grids
 */
export const useBatchIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    staggerDelay = 100
  } = options;

  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate]');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-visible');
              
              // Remove will-change after animation
              setTimeout(() => {
                entry.target.classList.add('animation-complete');
              }, 1000);
            }, index * staggerDelay);
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [threshold, rootMargin, staggerDelay]);
};
