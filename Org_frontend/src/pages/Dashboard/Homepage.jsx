import React from 'react';
import { motion } from 'framer-motion';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to DSA Buddy Dashboard
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your journey to mastering Data Structures and Algorithms starts here.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-lg p-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">Problems Solved</h3>
              <p className="text-3xl font-bold text-cyan-400">42</p>
            </motion.div>
            
            <motion.div
              className="bg-black/20 backdrop-blur-lg border border-blue-400/20 rounded-lg p-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">Current Streak</h3>
              <p className="text-3xl font-bold text-blue-400">7 days</p>
            </motion.div>
            
            <motion.div
              className="bg-black/20 backdrop-blur-lg border border-cyan-300/20 rounded-lg p-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">Rank</h3>
              <p className="text-3xl font-bold text-cyan-300">#1,234</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Homepage;