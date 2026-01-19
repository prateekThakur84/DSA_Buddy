import React from 'react';
import { motion } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodeEditor from './CodeEditor';
import ResultsPanel from './ResultsPanel';
import { GripHorizontal } from 'lucide-react';

const RightPanel = ({
  code,
  onCodeChange,
  selectedLanguage,
  onLanguageChange,
  languages,
  loading,
  runResult,
  submitResult,
  onRunCode,
  onSubmitCode,
  onResetCode,
  problemId
}) => {
  return (
    <div className="h-full w-full bg-[#0d1117] relative">
      <PanelGroup direction="vertical" className="h-full">
        
        {/* --- Top Panel: Code Editor --- */}
        <Panel 
          defaultSize={60} 
          minSize={30}
          className="h-full flex flex-col"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <CodeEditor
              code={code}
              onCodeChange={onCodeChange}
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              languages={languages}
              loading={loading}
              onRunCode={onRunCode}
              onSubmitCode={onSubmitCode}
              onResetCode={onResetCode}
            />
          </motion.div>
        </Panel>

        {/* --- Custom Horizontal Resize Handle --- */}
        <PanelResizeHandle className="h-1.5 bg-[#0b0f19] hover:bg-cyan-900/30 transition-colors flex items-center justify-center group relative z-50 focus:outline-none cursor-row-resize">
          {/* Invisible larger hit area for easier grabbing */}
          <div className="absolute inset-x-0 -top-2 -bottom-2 group-hover:bg-cyan-500/5 transition-colors"></div>
          
          {/* Visible Handle Bar */}
          <div className="w-16 h-1 rounded-full bg-gray-700 group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center justify-center">
             {/* Optional: Tiny grip icon opacity change */}
             <GripHorizontal size={12} className="text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </PanelResizeHandle>

        {/* --- Bottom Panel: Results/Terminal --- */}
        <Panel 
          defaultSize={40} 
          minSize={20}
          className="h-full flex flex-col bg-[#0b0f19]"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <ResultsPanel
              runResult={runResult}
              submitResult={submitResult}
              loading={loading}
              questionId={problemId}
            />
          </motion.div>
        </Panel>

      </PanelGroup>
    </div>
  );
};

export default RightPanel;