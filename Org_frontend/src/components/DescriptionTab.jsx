import React from 'react';
import { motion } from 'framer-motion';

const DescriptionTab = ({ problem }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Problem Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty?.toUpperCase()}
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {problem.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Problem Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
      >
        <h2 className="text-lg font-semibold mb-4 text-cyan-300">Problem Statement</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {problem.description}
        </p>
      </motion.div>

      {/* Examples */}
      {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-cyan-300">Examples</h2>
          {problem.visibleTestCases.map((testCase, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <h3 className="font-medium mb-3 text-white">Example {index + 1}:</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-400">Input:</span>
                  <div className="mt-1 bg-gray-900/50 rounded p-3 font-mono text-sm text-green-300">
                    {testCase.input}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-400">Output:</span>
                  <div className="mt-1 bg-gray-900/50 rounded p-3 font-mono text-sm text-blue-300">
                    {testCase.output}
                  </div>
                </div>
                
                {testCase.explanation && (
                  <div>
                    <span className="text-sm font-medium text-gray-400">Explanation:</span>
                    <div className="mt-1 text-sm text-gray-300">
                      {testCase.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Statistics */}
      {problem.statistics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Statistics</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{problem.statistics.totalSubmissions}</div>
              <div className="text-sm text-gray-400">Total Submissions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{problem.statistics.acceptedSubmissions}</div>
              <div className="text-sm text-gray-400">Accepted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{problem.statistics.acceptanceRate?.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Acceptance Rate</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DescriptionTab;
