import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, BookOpen, Video, Send, Bot, Sparkles } from "lucide-react";
import DescriptionTab from "../DescriptionTab";
import EditorialTab from "./EditorialTab";
import VideoSolutionTab from "./VideoSolutionTab";
import SubmissionsTab from "./SubmissionsTab";
import ChatAi from "./ChatAi";

const LeftPanel = ({ problem, submissions, activeTab, onTabChange }) => {
  // 1. Track which tabs have been clicked at least once
  const [visitedTabs, setVisitedTabs] = useState(new Set([activeTab]));

  // 2. Whenever activeTab changes, add it to the visited set
  useEffect(() => {
    setVisitedTabs((prev) => {
      const newSet = new Set(prev);
      newSet.add(activeTab);
      return newSet;
    });
  }, [activeTab]);

  const tabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "editorial", label: "Editorial", icon: BookOpen },
    { id: "video", label: "Video Solution", icon: Video },
    { id: "submissions", label: "Submissions", icon: Send },
    { id: "ai", label: "AI Assistant", icon: Sparkles },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0d1117] border-r border-[#30363d] relative">
      
      {/* Top Decoration Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10"></div>

      {/* Tab Navigation */}
      <div className="flex-shrink-0 bg-[#0d1117] border-b border-[#30363d] select-none">
        <div className="flex overflow-x-auto scrollbar-hide items-end">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative px-4 py-3 flex items-center gap-2 text-xs font-medium 
                  transition-all duration-200 whitespace-nowrap outline-none border-t-2
                  ${
                    isActive
                      ? "text-gray-200 bg-[#1e1e1e] border-t-cyan-500 border-r border-r-[#30363d] border-l border-l-[#30363d]"
                      : "text-gray-500 hover:text-gray-300 hover:bg-[#161b22] border-t-transparent border-r border-r-transparent border-l border-l-transparent"
                  }
                `}
              >
                <Icon size={14} className={isActive ? (tab.id === 'ai' ? "text-purple-400" : "text-cyan-400") : ""} />
                <span className={isActive ? "text-white" : ""}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - The "Keep Alive" Implementation */}
      <div className="flex-1 overflow-hidden relative bg-[#0d1117]">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent p-4 custom-scrollbar">
          
          {/* DESCRIPTION */}
          <div className={activeTab === "description" ? "block h-full animate-in fade-in duration-300" : "hidden"}>
             <DescriptionTab problem={problem} />
          </div>

          {/* EDITORIAL */}
          {visitedTabs.has("editorial") && (
            <div className={activeTab === "editorial" ? "block h-full animate-in fade-in duration-300" : "hidden"}>
              <EditorialTab problem={problem} key={problem._id} /> 
            </div>
          )}

          {/* VIDEO SOLUTION */}
          {visitedTabs.has("video") && (
            <div className={activeTab === "video" ? "block h-full animate-in fade-in duration-300" : "hidden"}>
              <VideoSolutionTab problem={problem} key={problem._id} />
            </div>
          )}

          {/* SUBMISSIONS */}
          {visitedTabs.has("submissions") && (
            <div className={activeTab === "submissions" ? "block h-full animate-in fade-in duration-300" : "hidden"}>
              <SubmissionsTab submissions={submissions} />
            </div>
          )}

          {/* AI CHAT */}
          {visitedTabs.has("ai") && (
            <div className={activeTab === "ai" ? "block h-full animate-in fade-in duration-300" : "hidden"}>
              <ChatAi problem={problem} key={problem._id} />
            </div>
          )}
          
        </div>
      </div>
      
      {/* Global Style for Custom Scrollbar within this component scope */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #30363d; 
          border-radius: 4px; 
          border: 2px solid #0d1117;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #484f58; 
        }
      `}</style>
    </div>
  );
};

export default LeftPanel;