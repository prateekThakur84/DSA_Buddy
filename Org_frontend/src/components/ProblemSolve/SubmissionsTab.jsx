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
  Terminal
} from 'lucide-react';

const SubmissionsTab = ({ submissions }) => {
  const [selected, setSelected] = useState(null);
  const [showError, setShowError] = useState(false);

  // Return early if no submissions
  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center bg-[#0d1117]">
        <div className="w-16 h-16 bg-[#161b22] rounded-full flex items-center justify-center border border-[#30363d] mb-4">
           <TestTube size={24} className="opacity-50" />
        </div>
        <h3 className="text-sm font-medium text-gray-300">No submissions yet</h3>
        <p className="text-xs mt-1 max-w-[200px]">Run your code against test cases to see your results here.</p>
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
          bg: 'bg-green-500/10', 
          border: 'border-green-500/20',
          label: 'Accepted'
        };
      case 'wrong':
      case 'wrong answer':
        return { 
          icon: XCircle, 
          color: 'text-red-400', 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/20',
          label: 'Wrong Answer'
        };
      case 'error':
      case 'compilation error':
        return { 
          icon: AlertTriangle, 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/10', 
          border: 'border-yellow-500/20',
          label: 'Error'
        };
      case 'timeout':
      case 'time limit exceeded':
        return { 
          icon: Clock, 
          color: 'text-orange-400', 
          bg: 'bg-orange-500/10', 
          border: 'border-orange-500/20',
          label: 'TLE'
        };
      default:
        return { 
          icon: Terminal, 
          color: 'text-gray-400', 
          bg: 'bg-gray-500/10', 
          border: 'border-gray-500/20',
          label: 'Unknown'
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

  return (
    <div className="h-full bg-[#0d1117] flex flex-col relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">History</h2>
          <span className="text-[10px] bg-[#161b22] text-gray-400 px-2 py-0.5 rounded-full border border-[#30363d]">
            {visibleSubmissions.length} Total
          </span>
        </div>

        {visibleSubmissions.map((sub, idx) => {
          const cfg = getStatusConfig(sub.status);
          const Icon = cfg.icon;
          return (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setSelected(sub);
                setShowError(false);
              }}
              className={`
                group cursor-pointer rounded-lg p-3 border transition-all duration-200
                bg-[#161b22] border-[#30363d] hover:border-cyan-500/30 hover:bg-[#1c2128]
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${cfg.color}`}>
                      {cfg.label}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-500 font-mono bg-[#0d1117] px-1.5 rounded border border-[#30363d]">
                            {sub.language}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            {fmt(sub.createdAt)}
                        </span>
                    </div>
                  </div>
                </div>
                
                {/* Right side stats for Accepted */}
                {sub.executionDetails && sub.status === 'accepted' && (
                    <div className="text-right hidden sm:block">
                        <div className="text-[11px] text-gray-400 flex items-center justify-end gap-1">
                            <Clock size={12} /> {sub.executionDetails.runtime}ms
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                            {sub.executionDetails.memory}KB
                        </div>
                    </div>
                )}
                
                <div className="sm:hidden text-gray-600 group-hover:text-cyan-400 pt-2">
                    <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ======= DETAIL MODAL ======= */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            {/* Modal Window */}
            <motion.div
              className="relative w-full max-w-2xl bg-[#0d1117] rounded-xl border border-[#30363d] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusConfig(selected.status).bg}`}>
                        {React.createElement(getStatusConfig(selected.status).icon, { 
                            size: 20, 
                            className: getStatusConfig(selected.status).color 
                        })}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-200">Submission Details</h3>
                        <p className="text-xs text-gray-500">{fmt(selected.createdAt)}</p>
                    </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                
                {/* Stats Grid */}
                {selected.executionDetails && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <Clock size={20} className="text-blue-400 mb-2" />
                            <span className="text-lg font-bold text-white">{selected.executionDetails.runtime}ms</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Runtime</span>
                        </div>
                        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <MemoryStick size={20} className="text-purple-400 mb-2" />
                            <span className="text-lg font-bold text-white">{selected.executionDetails.memory}KB</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Memory</span>
                        </div>
                        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <TestTube size={20} className="text-green-400 mb-2" />
                            <span className="text-lg font-bold text-white">
                                {selected.executionDetails.testCasesPassed}/{selected.executionDetails.testCasesTotal}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Test Cases</span>
                        </div>
                    </div>
                )}

                {/* Source Code */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source Code</span>
                    <span className="text-xs text-gray-500 font-mono bg-[#161b22] px-2 py-0.5 rounded">{selected.language}</span>
                  </div>
                  <div className="bg-[#010409] border border-[#30363d] rounded-lg overflow-hidden relative group/code">
                    <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto custom-scrollbar">
                      {selected.code}
                    </pre>
                  </div>
                </div>

                {/* Error Details Accordion */}
                {selected.errorDetails?.errorMessage && (
                  <div className="border border-red-500/20 bg-red-500/5 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowError(!showError)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-red-500/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle size={18} />
                        <span className="font-semibold text-sm">Compilation / Runtime Error</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className={`text-red-400 transition-transform duration-200 ${showError ? 'rotate-90' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {showError && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-xs font-mono text-red-300 whitespace-pre-wrap border-t border-red-500/20">
                            <div className="mt-4">{selected.errorDetails.errorMessage}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #484f58; }
      `}</style>
    </div>
  );
};

export default SubmissionsTab;