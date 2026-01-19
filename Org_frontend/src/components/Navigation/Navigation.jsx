import { motion } from "framer-motion";
import { useSelector } from "react-redux";

// Component imports
import Logo from "./Logo";
import CentralNavigation from "./CentralNavigation";
import ProfileSection from "./ProfileSection";
import MobileMenu from "./MobileMenu";
import MobileMenuButton from "./MobileMenuButton";
import UsageIndicator from '../../components/common/UsageIndicator';

// Hook and constant imports
import {
  useScrollDetection,
  useActiveTab,
  useMobileMenu,
} from "./navigationHooks";

import { ANIMATION_VARIANTS } from "./navigationConstants";

const Navigation = () => {
  // Custom hooks for state management
  const scrolled = useScrollDetection();
  const [activeTab, setActiveTab] = useActiveTab();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  // Redux state
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
        variants={ANIMATION_VARIANTS.header}
        animate={scrolled ? "scrolled" : "top"}
        initial="top"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo scrolled={scrolled} />

            <CentralNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scrolled={scrolled}
            />

            

            <ProfileSection
              scrolled={scrolled}
              isAuthenticated={isAuthenticated}
              user={user}
            />

            {/* <UsageIndicator/> */}

            <MobileMenuButton
              isOpen={mobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </div>
        </div>

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={closeMobileMenu}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </motion.header>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 bg-slate-950 selection:bg-cyan-500"></div>
    </>
  );
};

export default Navigation;
