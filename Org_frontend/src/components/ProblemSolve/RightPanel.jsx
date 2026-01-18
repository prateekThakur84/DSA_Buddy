import React from 'react';
import { motion } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodeEditor from './CodeEditor';
import ResultsPanel from './ResultsPanel';
import ResizableHandle from '../ProblemSolve/ResizableHandle';

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
    <div className="h-full bg-gray-900">
      <PanelGroup direction="vertical" className="h-full">
        {/* Code Editor Section */}
        <Panel 
          defaultSize={60} 
          minSize={30}
          className="h-full"
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

        {/* Resize Handle */}
        <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center">
          <ResizableHandle direction="horizontal" />
        </PanelResizeHandle>

        {/* Results Section */}
        <Panel 
          defaultSize={40} 
          minSize={20}
          className="h-full"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
