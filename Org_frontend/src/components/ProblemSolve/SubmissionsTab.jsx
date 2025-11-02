import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MemoryStick,
  TestTube,
  Code,
  X,
  ChevronRight,
  Crown
} from 'lucide-react';

const SubmissionsTab = ({ submissions }) => {
  const [selected, setSelected] = useState(null);
  const [showError, setShowError] = useState(false);

  // Return early if no submissions
  if (!submissions || submissions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        <TestTube size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">No submissions yet</p>
        <p className="text-sm mt-2">Submit your code to see results here</p>
      </div>
    );
  }

  // Filter out pending submissions
  const visibleSubmissions = submissions.filter((s) => {
    const status = s.status?.toLowerCase();
    return !['pending', 'processing', 'in queue', 'waiting'].includes(status);
  });

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return { 
          icon: CheckCircle, 
          color: 'text-green-400', 
          bg: 'bg-green-500/20', 
          border: 'border-green-500/30' 
        };
      case 'wrong':
      case 'wrong answer':
        return { 
          icon: XCircle, 
          color: 'text-red-400', 
          bg: 'bg-red-500/20', 
          border: 'border-red-500/30' 
        };
      case 'error':
      case 'compilation error':
        return { 
          icon: AlertTriangle, 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/20', 
          border: 'border-yellow-500/30' 
        };
      case 'timeout':
        return { 
          icon: Clock, 
          color: 'text-orange-400', 
          bg: 'bg-orange-500/20', 
          border: 'border-orange-500/30' 
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-gray-400', 
          bg: 'bg-gray-500/20', 
          border: 'border-gray-500/30' 
        };
    }
  };

  const fmt = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Handle case when all are pending
  if (visibleSubmissions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        <Clock size={48} className="mx-auto mb-4 animate-spin text-cyan-400" />
        <p className="text-lg">Processing submissions...</p>
        <p className="text-sm mt-2">This may take a few moments</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-4 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-cyan-300">Your Submissions</h2>
          <span className="text-sm text-gray-400">
            {visibleSubmissions.length} submission{visibleSubmissions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {visibleSubmissions.map((sub, idx) => {
          const cfg = getStatusConfig(sub.status);
          const Icon = cfg.icon;
          return (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`cursor-pointer bg-gray-800/50 rounded-lg p-4 border ${cfg.border} hover:border-cyan-500/50 hover:bg-gray-800/70 transition-all`}
              onClick={() => {
                setSelected(sub);
                setShowError(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div>
                    <span className={`font-medium capitalize ${cfg.color}`}>
                      {sub.status}
                    </span>
                    <div className="text-sm text-gray-400">
                      {sub.language} • {fmt(sub.createdAt)}
                    </div>
                    {sub.executionDetails && sub.status === 'accepted' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {sub.executionDetails.runtime}ms • {sub.executionDetails.memory}KB
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ======= MODAL SECTION ======= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-lg overflow-hidden max-w-3xl w-full max-h-[90vh] border border-cyan-500/30 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gray-800/50 p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">Submission Details</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <span className="block text-xs text-gray-400 mb-1">Status</span>
                    <span className={`font-medium capitalize ${getStatusConfig(selected.status).color}`}>
                      {selected.status}
                    </span>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <span className="block text-xs text-gray-400 mb-1">Language</span>
                    <span className="font-medium text-white capitalize">{selected.language}</span>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 col-span-2 md:col-span-1">
                    <span className="block text-xs text-gray-400 mb-1">Submitted</span>
                    <span className="font-medium text-white text-sm">{fmt(selected.createdAt)}</span>
                  </div>

                  {selected.executionDetails && (
                    <>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <span className="block text-xs text-gray-400 mb-1">Runtime</span>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-blue-400" />
                          <span className="font-medium text-white">
                            {selected.executionDetails.runtime}ms
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <span className="block text-xs text-gray-400 mb-1">Memory</span>
                        <div className="flex items-center space-x-2">
                          <MemoryStick size={16} className="text-purple-400" />
                          <span className="font-medium text-white">
                            {selected.executionDetails.memory}KB
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <span className="block text-xs text-gray-400 mb-1">Test Cases</span>
                        <div className="flex items-center space-x-2">
                          <TestTube size={16} className="text-green-400" />
                          <span className="font-medium text-white">
                            {selected.executionDetails.testCasesPassed}/{selected.executionDetails.testCasesTotal}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Source Code */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-white flex items-center">
                      <Code size={18} className="mr-2 text-cyan-400" />
                      Source Code
                    </h4>
                  </div>
                  <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <pre className="p-4 font-mono text-sm text-green-300 overflow-auto max-h-80">
                      {selected.code}
                    </pre>
                  </div>
                </div>

                {/* Error Details */}
                {selected.errorDetails?.errorMessage && (
                  <div>
                    <button
                      onClick={() => setShowError((v) => !v)}
                      className="flex items-center text-yellow-300 hover:text-yellow-100 mb-3 transition-colors font-medium"
                    >
                      <AlertTriangle size={18} className="mr-2" />
                      Error Details
                      <motion.div
                        animate={{ rotate: showError ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2"
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {showError && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            {selected.errorDetails.errorType && (
                              <div className="font-medium text-red-400 mb-2 uppercase text-sm">
                                {selected.errorDetails.errorType.replace('_', ' ')} ERROR
                              </div>
                            )}
                            <div className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                              {selected.errorDetails.errorMessage}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubmissionsTab;