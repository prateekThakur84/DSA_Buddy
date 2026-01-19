import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Send, 
  RotateCcw, 
  ChevronDown, 
  Code2, 
  FileCode,
  Check,
  Loader
} from 'lucide-react';

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
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLanguageDisplayName = (lang) => {
    const names = { 
      javascript: 'JavaScript', 
      'c++': 'C++', 
      java: 'Java',
      python: 'Python'
    };
    return names[lang] || lang;
  };

  const getFileExtension = (lang) => {
      const exts = {
          javascript: 'js',
          'c++': 'cpp',
          java: 'java',
          python: 'py'
      };
      return exts[lang] || 'txt';
  };

  const getMonacoLanguage = (lang) => {
    const mapping = { 
      'c++': 'cpp', 
      javascript: 'javascript', 
      java: 'java',
      python: 'python'
    };
    return mapping[lang] || lang;
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] relative group overflow-hidden">
      
      {/* --- Top Toolbar --- */}
      <div className="flex-shrink-0 bg-[#0d1117] h-11 flex items-center justify-between px-0 border-b border-[#30363d] select-none">
        
        {/* Left: VS Code Style Active Tab */}
        <div className="flex items-end h-full">
            <div className="h-full flex items-center gap-2 px-4 bg-[#1e1e1e] border-t-2 border-t-cyan-500 text-gray-200 text-xs font-medium font-sans min-w-[120px]">
                <FileCode size={13} className="text-cyan-400" />
                <span>main.{getFileExtension(selectedLanguage)}</span>
            </div>
            {/* Inactive Tab background area */}
            <div className="h-full w-4 bg-[#0d1117] border-b border-[#30363d]"></div>
        </div>

        {/* Right: Actions & Language */}
        <div className="flex items-center gap-3 pr-4 h-full">
          
          {/* Custom Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-[#8b949e] rounded text-xs text-gray-300 transition-all duration-200 min-w-[110px] justify-between"
            >
              <div className="flex items-center gap-2">
                 {/* Little dot indicator */}
                 <span className={`w-1.5 h-1.5 rounded-full ${
                     selectedLanguage === 'javascript' ? 'bg-yellow-400' :
                     selectedLanguage === 'c++' ? 'bg-blue-500' :
                     selectedLanguage === 'java' ? 'bg-red-500' : 'bg-green-500'
                 }`}></span>
                 <span>{getLanguageDisplayName(selectedLanguage)}</span>
              </div>
              <ChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-[#1e1e1e] border border-[#454545] rounded-md shadow-2xl overflow-hidden z-50 py-1"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        onLanguageChange(lang.id);
                        setIsLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#2d2d2d] hover:text-white flex items-center justify-between group/item"
                    >
                      <span>{lang.name}</span>
                      {selectedLanguage === lang.id && (
                        <Check size={12} className="text-cyan-400" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-[1px] bg-[#30363d] mx-1"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Reset */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetCode}
              disabled={loading}
              title="Reset Code"
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#30363d] transition-colors disabled:opacity-50"
            >
              <RotateCcw size={15} />
            </motion.button>

            {/* Run */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRunCode}
              disabled={loading}
              className="
                flex items-center gap-2 px-3 py-1.5 bg-[#238636] text-white 
                rounded hover:bg-[#2ea043] transition-all text-xs font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(240,246,252,0.1)]
              "
            >
              {loading ? <Loader size={13} className="animate-spin" /> : <Play size={13} />}
              <span>Run</span>
            </motion.button>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSubmitCode}
              disabled={loading}
              className="
                flex items-center gap-2 px-3 py-1.5 bg-[#1f6feb] text-white 
                rounded hover:bg-[#388bfd] transition-all text-xs font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(240,246,252,0.1)]
              "
            >
              {loading ? <Loader size={13} className="animate-spin" /> : <Send size={13} />}
              <span>Submit</span>
            </motion.button>

          </div>
        </div>
      </div>

      {/* --- Monaco Editor --- */}
      <div className="flex-1 min-h-0 relative bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={getMonacoLanguage(selectedLanguage)}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            selectOnLineNumbers: true,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: "on",
            contextmenu: true,
            mouseWheelZoom: true,
            padding: { top: 16, bottom: 16 },
            formatOnPaste: true,
            formatOnType: true,
            scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
            }
          }}
        />
        
        {/* Subtle Loading Overlay */}
        {loading && (
             <div className="absolute inset-0 bg-[#1e1e1e]/60 backdrop-blur-[1px] z-10 flex items-end justify-end p-6 pointer-events-none">
                 <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117] border border-cyan-500/20 rounded-full shadow-xl">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                     </span>
                     <span className="text-xs font-mono text-cyan-400">Compiling...</span>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;