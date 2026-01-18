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
  Terminal
} from 'lucide-react';

const ResultsPanel = ({ runResult, submitResult, loading, questionId }) => {
  const [activeTab, setActiveTab] = useState('run');
  const [expandedTestCase, setExpandedTestCase] = useState(null);

  // ✅ FIX: Reset internal state when the question changes
  useEffect(() => {
    setActiveTab('run');
    setExpandedTestCase(null);
  }, [questionId]);

  // Always show tabs at top
  const renderTabs = () => (
    <div className="flex border-b border-gray-700 bg-gray-900/50 sticky top-0 z-20">
      <button
        onClick={() => {
          setActiveTab('run');
          setExpandedTestCase(null);
        }}
        className={`flex-1 px-4 py-2 text-sm font-medium text-center transition-colors focus:outline-none ${
          activeTab === 'run'
            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Run Results
      </button>
      <button
        onClick={() => {
          setActiveTab('submit');
          setExpandedTestCase(null);
        }}
        className={`flex-1 px-4 py-2 text-sm font-medium text-center transition-colors focus:outline-none ${
          activeTab === 'submit'
            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Submit Results
      </button>
    </div>
  );

  const result = activeTab === 'run' ? runResult : submitResult;

  // Loading state
  if (loading) {
    return (
      <div className="h-full bg-gray-800/30 backdrop-blur-sm flex flex-col">
        {renderTabs()}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2" />
            <p className="text-gray-400">Running your code...</p>
          </div>
        </div>
      </div>
    );
  }

  // No result yet
  if (!result) {
    return (
      <div className="h-full bg-gray-800/30 backdrop-blur-sm flex flex-col">
        {renderTabs()}
        <div className="flex-1 p-4 text-center text-gray-400">
          <TestTube size={48} className="mx-auto mb-2" />
          <p>No results yet. Run or submit your code to see results.</p>
        </div>
      </div>
    );
  }

  // Check for compilation/syntax errors
  const hasCompilationError = result.errorType === 'compilation' || result.errorType === 'syntax';
  const hasRuntimeError = result.errorType === 'runtime';
  const hasTimeoutError = result.errorType === 'timeout';
  const hasMemoryError = result.errorType === 'memory_limit';

  // Render compilation/syntax error
  if (hasCompilationError) {
    return (
      <div className="h-full bg-gray-800/30 backdrop-blur-sm flex flex-col">
        {renderTabs()}
        <div className="p-4 overflow-auto flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4 mb-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-red-500/20 rounded-lg">
                <Code2 className="text-red-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
                  <AlertTriangle size={20} className="mr-2" />
                  Compilation Error
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Your code has syntax or compilation errors. Please fix them before running.
                </p>

                {/* Error Message Box */}
                <div className="bg-gray-900/80 rounded-lg p-4 border border-red-500/30">
                  <div className="flex items-center mb-2">
                    <Terminal size={16} className="text-red-400 mr-2" />
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                      Compiler Output
                    </span>
                  </div>
                  <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap break-words leading-relaxed">
{result.errorMessage || 'Unknown compilation error'}
                  </pre>
                </div>

                {/* Line number extraction if available */}
                {result.errorLine && (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-sm text-yellow-300">
                      <span className="font-semibold">Error at line {result.errorLine}</span>
                      {result.errorColumn && <span> : column {result.errorColumn}</span>}
                    </p>
                  </div>
                )}

                {/* Common fixes suggestion */}
                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Common Fixes:</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    <li>Check for missing semicolons or brackets</li>
                    <li>Verify variable declarations and types</li>
                    <li>Ensure proper syntax for your language</li>
                    <li>Check for typos in function/variable names</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render runtime error
  if (hasRuntimeError) {
    return (
      <div className="h-full bg-gray-800/30 backdrop-blur-sm flex flex-col">
        {renderTabs()}
        <div className="p-4 overflow-auto flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-500/10 border-2 border-orange-500/50 rounded-lg p-4 mb-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-orange-500/20 rounded-lg">
                <Bug className="text-orange-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-400 mb-2 flex items-center">
                  <AlertTriangle size={20} className="mr-2" />
                  Runtime Error
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Your code compiled successfully but encountered an error during execution.
                </p>

                {/* Error Message Box */}
                <div className="bg-gray-900/80 rounded-lg p-4 border border-orange-500/30">
                  <div className="flex items-center mb-2">
                    <Terminal size={16} className="text-orange-400 mr-2" />
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                      Runtime Output
                    </span>
                  </div>
                  <pre className="text-xs font-mono text-orange-300 whitespace-pre-wrap break-words leading-relaxed">
{result.errorMessage || 'Unknown runtime error'}
                  </pre>
                </div>

                {/* Failed test case info */}
                {result.failedTestCase && (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-sm text-yellow-300">
                      <span className="font-semibold">Failed at Test Case {result.failedTestCase}</span>
                    </p>
                  </div>
                )}

                {/* Common runtime error tips */}
                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Common Runtime Errors:</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    <li>Index out of bounds / Array access error</li>
                    <li>Null pointer / Undefined reference</li>
                    <li>Division by zero</li>
                    <li>Stack overflow (infinite recursion)</li>
                    <li>Type conversion errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render timeout error
  if (hasTimeoutError) {
    return (
      <div className="h-full bg-gray-800/30 backdrop-blur-sm flex flex-col">
        {renderTabs()}
        <div className="p-4 overflow-auto flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="text-yellow-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  Time Limit Exceeded
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Your code took too long to execute and was terminated.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Optimization Tips:</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    <li>Check for infinite loops</li>
                    <li>Optimize your algorithm complexity</li>
                    <li>Use more efficient data structures</li>
                    <li>Avoid nested loops where possible</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render memory limit error
  if (hasMemoryError) {
    return (
      <div className="h-full bg-gray-800/30 backdrop-blur-sm flex flex-col">
        {renderTabs()}
        <div className="p-4 overflow-auto flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-500/10 border-2 border-purple-500/50 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-purple-500/20 rounded-lg">
                <MemoryStick className="text-purple-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                  Memory Limit Exceeded
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Your code used too much memory and was terminated.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Memory Tips:</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    <li>Avoid creating unnecessary copies of data</li>
                    <li>Use more memory-efficient data structures</li>
                    <li>Clear unused variables</li>
                    <li>Check for memory leaks</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Normal results rendering (no errors)
  const total = result.totalTestCases || 0;
  const passed = result.passedTestCases || 0;
  const percent = total ? Math.round((passed / total) * 100) : 0;
  const overallPassed = result.success && passed === total;

  return (
    <div className="h-full bg-gray-800/30 backdrop-blur-sm flex flex-col">
      {renderTabs()}
      <div className="p-4 overflow-auto space-y-4 flex-1">
        {/* Status Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600/30 rounded-lg">
            <div className="flex items-center space-x-3">
              {overallPassed ? (
                <CheckCircle className="text-green-400" size={20} />
              ) : (
                <XCircle className="text-red-400" size={20} />
              )}
              <div>
                <span className="font-medium text-white">
                  {overallPassed ? 'Accepted' : 'Wrong Answer'}
                </span>
                <div className="text-sm text-gray-400">
                  {passed}/{total} passed ({percent}%)
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{(result.runtime * 1000).toFixed(2)} ms</span>
              </div>
              <div className="flex items-center space-x-1">
                <MemoryStick size={14} />
                <span>{result.memory} KB</span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                overallPassed ? 'bg-green-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Sample Test Case Accordion */}
        {result.results?.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              Sample Test Case
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg border-gray-600/30 bg-gray-700/50"
            >
              <button
                onClick={() =>
                  setExpandedTestCase(prev => (prev === 'sample' ? null : 'sample'))
                }
                className="w-full flex items-center justify-between p-3 hover:bg-gray-700/30 transition-colors focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <TestTube className="text-cyan-400" size={16} />
                  <span className="font-medium text-white">Input / Expected</span>
                </div>
                {expandedTestCase === 'sample' ? (
                  <ChevronDown className="text-gray-400" size={16} />
                ) : (
                  <ChevronRight className="text-gray-400" size={16} />
                )}
              </button>
              <AnimatePresence>
                {expandedTestCase === 'sample' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 pb-3 space-y-2 text-sm"
                  >
                    <div>
                      <span className="text-gray-400 font-medium">Input:</span>
                      <pre className="bg-gray-800/50 rounded p-2 mt-1 font-mono text-green-300">
                        {result.results[0].input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Expected:</span>
                      <pre className="bg-gray-800/50 rounded p-2 mt-1 font-mono text-blue-300">
                        {result.results[0].expectedOutput}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Detailed Test Cases */}
        {result.results?.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Test Cases</h3>
            <div className="space-y-2">
              {result.results.map((tc, idx) => (
                <motion.div
                  key={tc.testCaseNumber}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border rounded-lg ${
                    tc.passed
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-red-500/30 bg-red-500/10'
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedTestCase(prev => (prev === idx ? null : idx))
                    }
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-700/30 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      {tc.passed ? (
                        <CheckCircle className="text-green-400" size={16} />
                      ) : (
                        <XCircle className="text-red-400" size={16} />
                      )}
                      <span className="font-medium text-white">
                        Test Case {tc.testCaseNumber}
                      </span>
                      <span className="text-sm text-gray-400">
                        {tc.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    {expandedTestCase === idx ? (
                      <ChevronDown className="text-gray-400" size={16} />
                    ) : (
                      <ChevronRight className="text-gray-400" size={16} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedTestCase === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3 pb-3 space-y-2 text-sm"
                      >
                        <div>
                          <span className="text-gray-400 font-medium">Input:</span>
                          <pre className="bg-gray-800/50 rounded p-2 font-mono text-green-300">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Expected:</span>
                          <pre className="bg-gray-800/50 rounded p-2 font-mono text-blue-300">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Your Output:</span>
                          <pre
                            className={`bg-gray-800/50 rounded p-2 font-mono ${
                              tc.passed ? 'text-green-300' : 'text-red-300'
                            }`}
                          >
                            {tc.actualOutput}
                          </pre>
                        </div>
                        {tc.error && (
                          <div>
                            <span className="text-red-400 font-medium">Error:</span>
                            <div className="bg-red-500/10 rounded p-2 font-mono text-red-300 text-xs">
                              {tc.error}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;