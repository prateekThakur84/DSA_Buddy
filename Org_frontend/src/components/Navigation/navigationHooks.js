import { useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useLocation } from 'react-router';
import { SCROLL_THRESHOLD, NAV_ITEMS, ADMIN_NAV_ITEMS } from './navigationConstants';
import { getActiveTab } from './navigationUtils';

// Detect scroll and set 'scrolled' boolean
export const useScrollDetection = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > SCROLL_THRESHOLD);
  });

  return scrolled;
};

// Track active navigation tab
export const useActiveTab = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const currentTab = getActiveTab(location, NAV_ITEMS, ADMIN_NAV_ITEMS);
    setActiveTab(currentTab);
  }, [location.pathname]);

  return [activeTab, setActiveTab];
};

// Detect clicks outside a given ref
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

// Mobile menu open/close logic
export const useMobileMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return {
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  };
};

// Profile dropdown open/close logic
export const useProfileDropdown = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  return {
    profileDropdownOpen,
    toggleProfileDropdown,
    closeProfileDropdown,
  };
};
