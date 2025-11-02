import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, BookOpen, Video, Send, Bot } from "lucide-react";
import DescriptionTab from "../DescriptionTab";
import EditorialTab from "./EditorialTab";
import VideoSolutionTab from "./VideoSolutionTab";
import SubmissionsTab from "./SubmissionsTab";
import ChatAi from "./ChatAi";

const LeftPanel = ({ problem, submissions, activeTab, onTabChange }) => {
  const tabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "editorial", label: "Editorial", icon: BookOpen },
    { id: "video", label: "Video Solution", icon: Video },
    { id: "submissions", label: "Submissions", icon: Send },
    { id: "ai", label: "AI Chat", icon: Bot },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab problem={problem} />;
      case "editorial":
        return <EditorialTab problem={problem} />;
      case "video":
        return <VideoSolutionTab problem={problem} />;
      case "submissions":
        return <SubmissionsTab submissions={submissions} />;
      case "ai":
        return <ChatAi problem={problem} />;
      default:
        return <DescriptionTab problem={problem} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      {/* Tab Navigation - Fixed at top */}
      <div className=" border-b border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative min-w-max px-2 py-2 flex items-center gap-2 text-xs font-medium 
                  transition-all duration-200 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "text-blue-400 bg-gray-700"
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

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
