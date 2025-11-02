import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, Send, RotateCcw, Settings, Loader, ChevronDown } from 'lucide-react';

const CodeEditor = ({ 
  code, 
  onCodeChange, 
  selectedLanguage, 
  onLanguageChange, 
  languages, 
  loading, 
  onRunCode, 
  onSubmitCode, 
  onResetCode 
}) => {
  const editorRef = useRef(null);

  const getLanguageDisplayName = (lang) => {
    const names = { 
      javascript: 'JavaScript', 
      'c++': 'C++', 
      java: 'Java' 
    };
    return names[lang] || lang;
  };

  const getMonacoLanguage = (lang) => {
    const mapping = { 
      'c++': 'cpp', 
      javascript: 'javascript', 
      java: 'java' 
    };
    return mapping[lang] || lang;
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar - Fixed at top */}
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="
                  appearance-none bg-gray-700 text-white px-4 py-2 pr-10 rounded-lg
                  border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                  cursor-pointer text-sm font-medium min-w-[120px]
                "
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
              />
            </div>
            
            <div className="text-xs text-gray-400 hidden md:block">
              {getLanguageDisplayName(selectedLanguage)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetCode}
              disabled={loading}
              className="
                flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 
                rounded-lg hover:bg-gray-600 hover:text-white transition-all 
                text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRunCode}
              disabled={loading}
              className="
                flex items-center gap-2 px-4 py-2 bg-green-600 text-white 
                rounded-lg hover:bg-green-700 transition-all text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Play size={16} />}
              <span className="hidden sm:inline">Run</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSubmitCode}
              disabled={loading}
              className="
                flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                rounded-lg hover:bg-blue-700 transition-all text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              <span className="hidden sm:inline">Submit</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Monaco Editor - Flexible height */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={getMonacoLanguage(selectedLanguage)}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            selectOnLineNumbers: true,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            smoothScrolling: true,
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: true,
            contextmenu: true,
            mouseWheelZoom: true,
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
