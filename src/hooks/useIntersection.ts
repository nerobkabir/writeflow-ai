import { useState, useEffect, RefObject } from "react";

interface UseIntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export function useIntersection(
  elementRef: RefObject<Element | null>,
  options: UseIntersectionOptions = {}
): boolean {
  const { root = null, rootMargin = "0px", threshold = 0, triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(el);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);

    return () => {
      if (el && !triggerOnce) {
        observer.unobserve(el);
      }
    };
  }, [elementRef, root, rootMargin, threshold, triggerOnce]);

  return isIntersecting;
}
export default useIntersection;
