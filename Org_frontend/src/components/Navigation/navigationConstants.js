import { 
  Home, 
  Code, 
  Trophy, 
  MessageCircle, 
  Info, 
  Settings,
  UserCircle,
  Edit
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'problems', label: 'Problems', icon: Code, path: '/problems' },
  { id: 'about', label: 'About', icon: Info, path: '/about' },
  { id: 'pricing', label: 'Pricing', icon: MessageCircle, path: '/price' },
];

export const ADMIN_NAV_ITEMS = [
  { id: 'admin', label: 'Admin', icon: Settings, path: '/admin' },
];

export const PROFILE_DROPDOWN_ITEMS = [
  { 
    id: 'profile', 
    label: 'My Profile', 
    icon: UserCircle, 
    path: '/profile',
    description: 'View and edit your profile'
  },
  { 
    id: 'edit-profile', 
    label: 'Edit Profile', 
    icon: Edit, 
    path: '/profile/edit',
    description: 'Update your information'
  },
];

export const SCROLL_THRESHOLD = 100;

// Animation variants
export const ANIMATION_VARIANTS = {
  header: {
    top: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(6, 182, 212, 0)",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    scrolled: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(6, 182, 212, 0)",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  },
  centerNav: {
    top: {
      scale: 1,
      y: 0,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(8px)",
      borderColor: "rgba(6, 182, 212, 0.2)",
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    scrolled: {
      scale: 0.85,
      y: -2,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(20px)",
      borderColor: "rgba(6, 182, 212, 0.3)",
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  },
  sideElements: {
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    hidden: { 
      opacity: 0, 
      x: 0, 
      scale: 0.8,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  },
  dropdown: {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  },
  mobileMenu: {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 }
  }
};