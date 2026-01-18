import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import LeftPanel from "../../components/ProblemSolve/LeftPanel.jsx";
import RightPanel from "../../components/ProblemSolve/RightPanel.jsx";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import ResizableHandle from "../../components/ProblemSolve/ResizableHandle.jsx";

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

const ProblemPage = () => {
  // ✅ Get id from route params
  const { id } = useParams();
  
  // ✅ DEBUG: Log the URL parameter immediately
  console.log("🔍 URL Route Param (id):", id);

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

  // ✅ MAIN ISSUE: Fetch problem and submissions on mount
  useEffect(() => {
    console.log("📍 useEffect triggered, id:", id);
    
    if (id) {
      console.log("✅ ID exists, fetching problem...");

      dispatch(clearRunResult());
      dispatch(clearSubmitResult());
      
      dispatch(setCurrentProblem(id));
      dispatch(fetchProblemById(id)); // ✅ THIS SHOULD TRIGGER API CALL
      dispatch(fetchSubmissions(id));
      
      console.log("📤 Dispatched fetchProblemById and fetchSubmissions");
    } else {
      console.log("❌ ERROR: id is undefined!", { id });
    }
  }, [id, dispatch]);

  // Update code when language or problem changes
  useEffect(() => {
    console.log("🎯 Problem loaded:", problem?.title || "No problem yet");
    
    if (problem && problem.startCode) {
      const initialCode = problem.startCode.find(
        (c) => c.language === selectedLanguage
      );
      setCode(initialCode?.initialCode || "");
    }
  }, [selectedLanguage, problem]);

  // Handle run code
  const handleRunCode = async () => {
    dispatch(clearRunResult());
    dispatch(runCode({ problemId: id, code, language: selectedLanguage }));
  };

  // Handle submit code
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

  // Handle reset code
  const handleResetCode = () => {
    if (problem && problem.startCode) {
      const initialCode = problem.startCode.find(
        (c) => c.language === selectedLanguage
      );
      setCode(initialCode?.initialCode || "");
    }
  };

  // Loading state
  if (problemLoading && !problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <span className="text-cyan-400 font-medium">Loading problem...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400 mb-4">Problem not found</h2>
          <p className="text-gray-400">
            The problem you're looking for doesn't exist.
          </p>
          <p className="text-yellow-400 mt-2">Debug: id = {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[88vh] w-full bg-gray-900 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full"
      >
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={45} minSize={30} className="h-full">
            <LeftPanel
              problem={problem}
              submissions={submissions}
              activeTab={activeLeftTab}
              onTabChange={setActiveLeftTab}
              loading={submissionsLoading}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors">
            <ResizableHandle direction="vertical" />
          </PanelResizeHandle>

          <Panel defaultSize={55} minSize={35} className="h-full">
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
          </Panel>
        </PanelGroup>
      </motion.div>
    </div>
  );
};

export default ProblemPage;
