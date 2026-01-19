import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import LeftPanel from "../../components/ProblemSolve/LeftPanel.jsx";
import RightPanel from "../../components/ProblemSolve/RightPanel.jsx";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { 
  Loader2, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  GripVertical 
} from "lucide-react";

import {
  fetchProblemById,
  fetchSubmissions,
  runCode,
  submitCode,
  clearRunResult,
  clearSubmitResult,
  setCurrentProblem,
} from "../../store/slices/currentProblemSlice";

import { markProblemSolved } from "../../store/slices/problemsSlice";

import { useParams } from "react-router";
import { useEffect, useState } from "react";

// --- Styled Components for Visual consistency ---

const CircuitBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute -bottom-64 -left-64 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M10 10 L90 10 L90 90 L10 90 Z" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 4"/>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
    </svg>
  </div>
);

const FloatingCode = ({ children, className, delay }) => (
  <motion.div
    className={`absolute text-cyan-400/20 font-mono text-xs pointer-events-none ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: [0, 0.4, 0], y: -20 }}
    transition={{ repeat: Infinity, duration: 4, delay, ease: "linear" }}
  >
    {children}
  </motion.div>
);

const ProblemPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const {
    currentProblem: problem,
    currentSubmissions: submissions,
    loading: problemLoading,
    submissionsLoading,
    runResult,
    submitResult,
    codeRunning,
  } = useSelector((state) => state.currentProblem);

  // Local UI state
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeLeftTab, setActiveLeftTab] = useState("description");

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "c++", name: "C++" },
    { id: "java", name: "Java" },
  ];

  // Fetch problem and submissions
  useEffect(() => {
    if (id) {
      dispatch(clearRunResult());
      dispatch(clearSubmitResult());
      dispatch(setCurrentProblem(id));
      dispatch(fetchProblemById(id));
      dispatch(fetchSubmissions(id));
    }
  }, [id, dispatch]);

  // Update code when language or problem changes
  useEffect(() => {
    if (problem && problem.startCode) {
      const initialCode = problem.startCode.find(
        (c) => c.language === selectedLanguage
      );
      setCode(initialCode?.initialCode || "");
    }
  }, [selectedLanguage, problem]);

  // Handlers
  const handleRunCode = async () => {
    dispatch(clearRunResult());
    dispatch(runCode({ problemId: id, code, language: selectedLanguage }));
  };

  const handleSubmitCode = async () => {
    dispatch(clearSubmitResult());
    const result = await dispatch(
      submitCode({ problemId: id, code, language: selectedLanguage })
    );

    if (result.payload?.data?.success) {
      dispatch(markProblemSolved(id));
    }
    dispatch(fetchSubmissions(id));
  };

  const handleResetCode = () => {
    if (problem && problem.startCode) {
      const initialCode = problem.startCode.find(
        (c) => c.language === selectedLanguage
      );
      setCode(initialCode?.initialCode || "");
    }
  };

  // --- LOADING STATE ---
  if (problemLoading && !problem) {
    return (
      <div className="h-[calc(100vh-64px)] w-full bg-[#0B1021] flex flex-col items-center justify-center relative overflow-hidden">
        <CircuitBackground />
        
        {/* Floating Code Decorations */}
        <FloatingCode className="top-1/4 left-1/4" delay={0}>Loading context...</FloatingCode>
        <FloatingCode className="bottom-1/3 right-1/4" delay={1}>Fetching test cases...</FloatingCode>
        <FloatingCode className="top-1/3 right-1/3" delay={2}>Initializing editor...</FloatingCode>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 bg-[#0b0f19] border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-2xl">
              <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
            {/* Rotating Ring */}
            <motion.div 
              className="absolute inset-[-10px] border border-cyan-500/30 rounded-full border-dashed"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Initializing Environment</h2>
          <div className="flex items-center space-x-2 text-cyan-400/80 text-sm font-mono">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading Problem Data...</span>
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (!problem) {
    return (
      <div className="h-[calc(100vh-64px)] w-full bg-[#0B1021] flex flex-col items-center justify-center relative overflow-hidden">
        <CircuitBackground />
        <div className="relative z-10 max-w-md w-full p-8 bg-[#0b0f19]/80 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Problem Not Found</h2>
          <p className="text-gray-400 mb-6">
            We couldn't locate the problem configuration. It might have been moved or deleted.
          </p>
          <div className="px-4 py-2 bg-black/40 rounded-lg border border-white/5 inline-block">
            <code className="text-xs text-red-400 font-mono">Error ID: {id}</code>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN EDITOR STATE ---
  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#0B1021] text-white overflow-hidden flex flex-col">
      {/* Optional: Thin top border/glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 overflow-hidden p-2"
      >
        <PanelGroup direction="horizontal" className="h-full rounded-xl border border-white/5 bg-[#0b0f19]/50 backdrop-blur-sm shadow-2xl overflow-hidden">
          
          {/* LEFT PANEL (Problem Description) */}
          <Panel defaultSize={45} minSize={30} className="h-full flex flex-col">
            <div className="h-full overflow-hidden bg-[#0d1117]">
                  <LeftPanel
                    problem={problem}
                    submissions={submissions}
                    activeTab={activeLeftTab}
                    onTabChange={setActiveLeftTab}
                    loading={submissionsLoading}
                  />
            </div>
          </Panel>

          {/* CUSTOM RESIZE HANDLE */}
          <PanelResizeHandle className="w-1.5 bg-[#0b0f19] hover:bg-cyan-900/30 transition-colors flex items-center justify-center group relative z-50 focus:outline-none">
            <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-cyan-500/10 transition-colors"></div>
            <div className="h-12 w-1 rounded-full bg-gray-700 group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
          </PanelResizeHandle>

          {/* RIGHT PANEL (Code Editor) */}
          <Panel defaultSize={55} minSize={35} className="h-full flex flex-col">
             <div className="h-full overflow-hidden bg-[#0d1117]">
                <RightPanel
                  code={code}
                  onCodeChange={setCode}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                  languages={languages}
                  loading={codeRunning}
                  runResult={runResult}
                  submitResult={submitResult}
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                  onResetCode={handleResetCode}
                  problemId={id}
                />
            </div>
          </Panel>

        </PanelGroup>
      </motion.div>
    </div>
  );
};

export default ProblemPage;