import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollPosition = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      
      if (scrollY !== lastScrollY) {
        setScrollDirection(direction);
        setScrollPosition(scrollY);
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  return { scrollPosition, scrollDirection };
};