import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import NavItem from "./NavItem";
import {
  NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  ANIMATION_VARIANTS,
} from "./navigationConstants";

const CentralNavigation = ({ activeTab, setActiveTab, scrolled }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Combine navigation items
  const allNavItems = [
    ...NAV_ITEMS,
    ...(isAuthenticated && user?.role === "admin" ? ADMIN_NAV_ITEMS : []),
  ];

  return (
    <motion.nav
      className="hidden md:flex items-center space-x-1 border rounded-full px-6 py-2"
      variants={ANIMATION_VARIANTS.centerNav}
      animate={scrolled ? "scrolled" : "top"}
      initial="top"
    >
      {allNavItems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isActive={activeTab === item.id}
          onClick={setActiveTab}
          scrolled={scrolled}
        />
      ))}
    </motion.nav>
  );
};

export default CentralNavigation;
