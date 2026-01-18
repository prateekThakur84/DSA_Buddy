import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, BookOpen, Video, Send, Bot } from "lucide-react";
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
    { id: "ai", label: "AI Chat", icon: Bot },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative min-w-max px-4 py-3 flex items-center gap-2 text-xs font-medium 
                  transition-all duration-200 whitespace-nowrap outline-none
                  ${
                    activeTab === tab.id
                      ? "text-blue-400 bg-gray-700/50"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-750"
                  }
                `}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - The "Keep Alive" Implementation */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-4">
          
          {/* Key Concept: We map through ALL tabs. 
             If a tab has been visited, we render it.
             If it is NOT active, we hide it with CSS ('hidden').
             This keeps the component alive in the background.
          */}

          {/* DESCRIPTION */}
          <div className={activeTab === "description" ? "block h-full" : "hidden"}>
             <DescriptionTab problem={problem} />
          </div>

          {/* EDITORIAL */}
          {visitedTabs.has("editorial") && (
            <div className={activeTab === "editorial" ? "block h-full" : "hidden"}>
              <EditorialTab problem={problem} key={problem._id} /> 
            </div>
          )}

          {/* VIDEO SOLUTION */}
          {visitedTabs.has("video") && (
            <div className={activeTab === "video" ? "block h-full" : "hidden"}>
              {/* key={problem._id} ensures state resets when you switch to a NEW problem */}
              <VideoSolutionTab problem={problem} key={problem._id} />
            </div>
          )}

          {/* SUBMISSIONS */}
          {visitedTabs.has("submissions") && (
            <div className={activeTab === "submissions" ? "block h-full" : "hidden"}>
              <SubmissionsTab submissions={submissions} />
            </div>
          )}

          {/* AI CHAT */}
          {visitedTabs.has("ai") && (
            <div className={activeTab === "ai" ? "block h-full" : "hidden"}>
              <ChatAi problem={problem} key={problem._id} />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;