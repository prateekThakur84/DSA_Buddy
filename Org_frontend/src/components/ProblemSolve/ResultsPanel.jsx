import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  MemoryStick,
  TestTube,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Bug,
  Code2,
  Terminal,
  Play
} from 'lucide-react';

const ResultsPanel = ({ runResult, submitResult, loading, questionId }) => {
  const [activeTab, setActiveTab] = useState('run');
  const [expandedTestCase, setExpandedTestCase] = useState(null);

  // Reset state when problem changes
  useEffect(() => {
    setActiveTab('run');
    setExpandedTestCase(null);
  }, [questionId]);

  // If a submit result comes in, switch to submit tab automatically
  useEffect(() => {
    if (submitResult) setActiveTab('submit');
  }, [submitResult]);

  const result = activeTab === 'run' ? runResult : submitResult;

  // --- Render Tabs ---
  const renderTabs = () => (
    <div className="flex items-center border-b border-[#30363d] bg-[#0d1117] sticky top-0 z-20">
      <button
        onClick={() => { setActiveTab('run'); setExpandedTestCase(null); }}
        className={`flex-1 px-4 py-3 text-xs font-semibold text-center transition-all relative outline-none ${
          activeTab === 'run'
            ? 'text-cyan-400 bg-[#161b22]'
            : 'text-gray-500 hover:text-gray-300 hover:bg-[#161b22]/50'
        }`}
      >
        Run Code
        {activeTab === 'run' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
      </button>
      <button
        onClick={() => { setActiveTab('submit'); setExpandedTestCase(null); }}
        className={`flex-1 px-4 py-3 text-xs font-semibold text-center transition-all relative outline-none ${
          activeTab === 'submit'
            ? 'text-green-400 bg-[#161b22]'
            : 'text-gray-500 hover:text-gray-300 hover:bg-[#161b22]/50'
        }`}
      >
        Submit
        {activeTab === 'submit' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400" />}
      </button>
    </div>
  );

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="h-full bg-[#0d1117] flex flex-col">
        {renderTabs()}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16">
             <div className="absolute inset-0 border-4 border-[#30363d] rounded-full"></div>
             <div className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
             <Play className="absolute inset-0 m-auto text-cyan-400 w-6 h-6 fill-cyan-400/20" />
          </div>
          <div className="text-center">
             <h3 className="text-sm font-semibold text-gray-200">Executing Code...</h3>
             <p className="text-xs text-gray-500 mt-1">Running test cases against your solution</p>
          </div>
        </div>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!result) {
    return (
      <div className="h-full bg-[#0d1117] flex flex-col">
        {renderTabs()}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
          <div className="w-16 h-16 bg-[#161b22] rounded-full flex items-center justify-center border border-[#30363d] mb-4">
             <Terminal size={28} className="opacity-50" />
          </div>
          <h3 className="text-sm font-medium text-gray-300">Ready to Run</h3>
          <p className="text-xs mt-1 max-w-[200px]">Write your code and click Run or Submit to see the output here.</p>
        </div>
      </div>
    );
  }

  // --- ERROR HANDLING ---
  const hasCompilationError = result.errorType === 'compilation' || result.errorType === 'syntax';
  const hasRuntimeError = result.errorType === 'runtime';
  const hasTimeoutError = result.errorType === 'timeout' || result.errorType === 'time_limit_exceeded'; // Handle variant naming
  const hasMemoryError = result.errorType === 'memory_limit';

  if (hasCompilationError) {
    return (
      <div className="h-full bg-[#0d1117] flex flex-col">
        {renderTabs()}
        <div className="p-4 overflow-auto flex-1 custom-scrollbar">
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                <Code2 size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-400 mb-1">Compilation Error</h3>
                <p className="text-xs text-gray-400 mb-3">Your code failed to compile. Check for syntax errors.</p>
                
                <div className="bg-[#010409] border border-red-500/20 rounded-md p-3 font-mono text-xs text-red-300 whitespace-pre-wrap overflow-x-auto">
                   {result.errorMessage || 'Unknown compilation error'}
                </div>

                {result.errorLine && (
                   <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">
                      <AlertTriangle size={12} />
                      <span>Check Line {result.errorLine}{result.errorColumn ? `, Column ${result.errorColumn}` : ''}</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasRuntimeError) {
    return (
      <div className="h-full bg-[#0d1117] flex flex-col">
        {renderTabs()}
        <div className="p-4 overflow-auto flex-1 custom-scrollbar">
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                <Bug size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-orange-400 mb-1">Runtime Error</h3>
                <p className="text-xs text-gray-400 mb-3">An error occurred during execution.</p>
                
                <div className="bg-[#010409] border border-orange-500/20 rounded-md p-3 font-mono text-xs text-orange-300 whitespace-pre-wrap overflow-x-auto">
                   {result.errorMessage || 'Unknown runtime error'}
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                   <h4 className="text-xs font-semibold text-blue-400 mb-2">Common Causes:</h4>
                   <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                      <li>Index out of bounds</li>
                      <li>Accessing null/undefined properties</li>
                      <li>Infinite recursion (Stack Overflow)</li>
                      <li>Division by zero</li>
                   </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasTimeoutError) {
     return (
      <div className="h-full bg-[#0d1117] flex flex-col">
        {renderTabs()}
        <div className="p-4 overflow-auto flex-1 custom-scrollbar">
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-yellow-400 mb-1">Time Limit Exceeded</h3>
                <p className="text-xs text-gray-400 mb-3">Your code took too long to execute.</p>
                
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                   <h4 className="text-xs font-semibold text-blue-400 mb-2">Optimization Tips:</h4>
                   <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                      <li>Check for infinite loops (while/for conditions)</li>
                      <li>Reduce algorithmic complexity (e.g., O(n²) → O(n log n))</li>
                      <li>Use more efficient data structures (Map/Set)</li>
                   </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     );
  }

  // --- SUCCESS / STANDARD OUTPUT ---
  const total = result.totalTestCases || 0;
  const passed = result.passedTestCases || 0;
  const percent = total ? Math.round((passed / total) * 100) : 0;
  const overallPassed = result.success && passed === total;

  return (
    <div className="h-full bg-[#0d1117] flex flex-col relative">
      {renderTabs()}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        {/* Status Card */}
        <div>
           <div className={`p-4 rounded-t-lg border-x border-t flex items-center justify-between ${
               overallPassed 
               ? "bg-green-500/5 border-green-500/20" 
               : "bg-red-500/5 border-red-500/20"
           }`}>
               <div className="flex items-center gap-3">
                   {overallPassed 
                     ? <CheckCircle size={24} className="text-green-400" />
                     : <XCircle size={24} className="text-red-400" />
                   }
                   <div>
                       <h2 className={`text-base font-bold ${overallPassed ? "text-green-400" : "text-red-400"}`}>
                           {overallPassed ? "Accepted" : "Wrong Answer"}
                       </h2>
                       <p className="text-xs text-gray-400">
                           {passed}/{total} Test Cases Passed
                       </p>
                   </div>
               </div>
               
               {/* Stats (Runtime/Memory) */}
               <div className="text-right">
                   <div className="flex items-center justify-end gap-1.5 text-xs text-gray-300">
                       <Clock size={12} className="text-gray-500" />
                       <span>{(result.runtime * 1000).toFixed(0)}ms</span>
                   </div>
                   <div className="flex items-center justify-end gap-1.5 text-xs text-gray-300 mt-1">
                       <MemoryStick size={12} className="text-gray-500" />
                       <span>{result.memory}KB</span>
                   </div>
               </div>
           </div>
           
           {/* Progress Bar */}
           <div className="h-1.5 w-full bg-[#161b22] rounded-b-lg overflow-hidden border-x border-b border-[#30363d]">
               <div 
                  className={`h-full transition-all duration-700 ease-out ${overallPassed ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${percent}%` }}
               />
           </div>
        </div>

        {/* Test Cases List */}
        {result.results?.length > 0 && (
            <div className="space-y-3">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Test Cases</h3>
               
               {result.results.map((tc, idx) => (
                  <div key={idx} className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                      expandedTestCase === idx 
                      ? "bg-[#161b22] border-gray-600" 
                      : `bg-[#0d1117] ${tc.passed ? "border-green-900/30" : "border-red-900/30"}`
                  }`}>
                      <button
                         onClick={() => setExpandedTestCase(prev => (prev === idx ? null : idx))}
                         className="w-full flex items-center justify-between p-3 hover:bg-[#1c2128] transition-colors outline-none"
                      >
                          <div className="flex items-center gap-3">
                              {tc.passed 
                                ? <CheckCircle size={16} className="text-green-500" /> 
                                : <XCircle size={16} className="text-red-500" />
                              }
                              <span className={`text-sm font-medium ${tc.passed ? "text-gray-300" : "text-red-300"}`}>
                                  Test Case {tc.testCaseNumber}
                              </span>
                          </div>
                          {expandedTestCase === idx ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
                      </button>

                      <AnimatePresence>
                          {expandedTestCase === idx && (
                              <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="border-t border-[#30363d] bg-[#010409]"
                              >
                                  <div className="p-3 grid gap-3 text-xs font-mono">
                                      <div>
                                          <span className="text-gray-500 block mb-1">Input:</span>
                                          <div className="p-2 bg-[#0d1117] border border-[#30363d] rounded text-gray-300 whitespace-pre-wrap">
                                              {tc.input}
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                          <div>
                                              <span className="text-gray-500 block mb-1">Expected Output:</span>
                                              <div className="p-2 bg-[#0d1117] border border-[#30363d] rounded text-gray-300 whitespace-pre-wrap">
                                                  {tc.expectedOutput}
                                              </div>
                                          </div>
                                          <div>
                                              <span className="text-gray-500 block mb-1">Your Output:</span>
                                              <div className={`p-2 bg-[#0d1117] border rounded whitespace-pre-wrap ${
                                                  tc.passed ? "text-green-300 border-green-900/30" : "text-red-300 border-red-900/30"
                                              }`}>
                                                  {tc.actualOutput}
                                              </div>
                                          </div>
                                      </div>
                                      {tc.error && (
                                          <div className="p-2 bg-red-900/10 border border-red-900/30 rounded text-red-300">
                                              <span className="font-bold">Error:</span> {tc.error}
                                          </div>
                                      )}
                                  </div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
               ))}
            </div>
        )}

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #484f58; }
      `}</style>
    </div>
  );
};

export default ResultsPanel;