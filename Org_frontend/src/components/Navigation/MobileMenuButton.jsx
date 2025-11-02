import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const MobileMenuButton = ({ 
  isOpen, 
  onClick 
}) => {
  return (
    <motion.button
      className="md:hidden text-gray-300 bg-black/20 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-2"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </motion.button>
  );
};

export default MobileMenuButton;