import { useEffect, useRef, useState } from 'react';

export function useInfiniteItems(items, { initialCount = 24, step = 24 } = {}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount, items]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((current) => Math.min(current + step, items.length));
          }
        });
      },
      {
        rootMargin: '200px',
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [items.length, step]);

  return {
    visibleItems: items.slice(0, visibleCount),
    sentinelRef,
  };
}
