import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2, AlertTriangle, Check, Copy, Crown, Lock, Trash2, StopCircle, CornerDownLeft, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../../utils/axiosClient";
import { useSubscription } from "../../hooks/useSubscription";
import PaywallModal from "../common/PayWallModal";

const ChatAi = ({ problem }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyStates, setCopyStates] = useState({});
  const [showPaywall, setShowPaywall] = useState(false);
  
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Subscription Hooks
  const { isPremium, usageLimits, hasLimitReached } = useSubscription();
  const aiLimitReached = !isPremium && hasLimitReached('aiChatQueries');

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Initial Welcome Message
  useEffect(() => {
    setMessages([
      {
        from: "system",
        text: `Hi! I'm your AI tutor for **${problem?.title}**. \n\nI can help with **Logic**, **Optimization**, or **Debugging**.\n${!isPremium ? `_(Free Plan: ${usageLimits?.aiChatQueries?.remaining || 0} queries left)_` : ''}`,
      },
    ]);
  }, [problem, isPremium]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (aiLimitReached) {
      setShowPaywall(true);
      return;
    }

    const userMsg = { from: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const { data } = await axiosClient.post("/ai/chat", {
        messages: [...messages.filter(m => m.from !== 'system'), userMsg],
        problemContext: {
          title: problem.title,
          description: problem.description,
          testCases: problem?.visibleTestCases,
          starterCode: problem?.starterCode,
        },
      });
      setMessages((m) => [...m, { from: "bot", text: data.message }]);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.limitReached) {
        setError(err.response.data.message);
        setShowPaywall(true);
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = (codeId, text) => {
    navigator.clipboard.writeText(text);
    setCopyStates(p => ({ ...p, [codeId]: true }));
    setTimeout(() => setCopyStates(p => ({ ...p, [codeId]: false })), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-sm relative">
      
      {/* --- 1. Header (Unified Dark Blue/Cyan Theme) --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#0d1117] select-none">
        <div className="flex items-center gap-2">
          {/* Logo Container */}
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
             <Sparkles size={14} className="text-cyan-400" />
          </div>
          <div>
             <h3 className="text-sm font-semibold text-gray-200 leading-none">AI Assistant</h3>
             <span className="text-[10px] text-gray-500">Powered by Gemini</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {/* Usage Limit Badge */}
           {!isPremium && (
             <div className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                aiLimitReached 
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-[#161b22] border-[#30363d] text-cyan-400/90"
             }`}>
                {usageLimits?.aiChatQueries?.remaining || 0} left
             </div>
           )}
           
           {/* Clear Button */}
           <button 
             onClick={() => setMessages([{ from: "system", text: "Chat cleared. How can I help?" }])}
             className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-[#161b22]" 
             title="Clear Chat"
           >
             <Trash2 size={14} />
           </button>
        </div>
      </div>

      {/* --- 2. Chat Area --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth bg-[#0d1117]">
        {messages.map((msg, idx) => {
          const isUser = msg.from === "user";
          const isSystem = msg.from === "system";
          
          if (isSystem) {
             return (
               <div key={idx} className="flex justify-center my-6">
                 <span className="text-[11px] text-gray-500 bg-[#161b22] border border-[#30363d] px-3 py-1 rounded-full shadow-sm">
                    {msg.text.replace(/\*\*/g, '')}
                 </span>
               </div>
             );
          }

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                  isUser 
                  ? "bg-blue-600/20 border-blue-500/30"
                  : "bg-cyan-500/10 border-cyan-500/20"
              }`}>
                  {isUser ? (
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                  ) : (
                    <Bot size={16} className="text-cyan-400" />
                  )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                 isUser 
                 ? "bg-[#1f6feb] text-white rounded-tr-sm border border-transparent" 
                 : "bg-[#161b22] border border-[#30363d] text-gray-300 rounded-tl-sm"
              }`}>
                 <ReactMarkdown
                    components={{
                       p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                       a: ({href, children}) => <a href={href} target="_blank" className="text-cyan-400 hover:underline">{children}</a>,
                       strong: ({children}) => <span className="font-bold text-white">{children}</span>,
                       ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                       code: ({node, inline, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeText = String(children).replace(/\n$/, '');
                          const id = `code-${idx}-${Math.random()}`;
                          
                          if (!inline && match) {
                            return (
                              <div className="my-3 rounded-lg border border-[#30363d] overflow-hidden bg-[#0d1117]">
                                <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-[#30363d]">
                                   <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold">{match[1]}</span>
                                   <button 
                                      onClick={() => handleCopy(id, codeText)} 
                                      className="text-gray-500 hover:text-white transition-colors"
                                      title="Copy"
                                   >
                                      {copyStates[id] ? <Check size={13} className="text-green-400"/> : <Copy size={13}/>}
                                   </button>
                                </div>
                                <SyntaxHighlighter 
                                  style={vscDarkPlus} 
                                  language={match[1]} 
                                  PreTag="div"
                                  className="!bg-[#0d1117] !p-3 !m-0 !text-xs !font-mono"
                                  {...props}
                                >
                                  {codeText}
                                </SyntaxHighlighter>
                              </div>
                            );
                          }
                          return (
                            <code className="bg-[rgba(175,184,193,0.15)] px-1.5 py-0.5 rounded text-[12px] font-mono text-cyan-200" {...props}>
                              {children}
                            </code>
                          );
                       }
                    }}
                 >
                    {msg.text}
                 </ReactMarkdown>
              </div>
            </motion.div>
          );
        })}
        
        {/* Loading Indicator */}
        {loading && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                 <Loader2 size={16} className="text-cyan-400 animate-spin" />
              </div>
              <div className="px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-2xl rounded-tl-sm flex gap-1.5 items-center h-10 shadow-sm">
                 <span className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce" />
                 <span className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce delay-100" />
                 <span className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce delay-200" />
              </div>
           </motion.div>
        )}

        {/* Error Message */}
        {error && (
           <div className="flex justify-center">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-900/10 border border-red-500/20 rounded-lg text-red-400 text-xs shadow-sm">
                 <AlertTriangle size={14} />
                 <span>{error}</span>
              </div>
           </div>
        )}
        
        <div ref={endRef} />
      </div>

      {/* --- 3. Input Area --- */}
      <div className="p-4 bg-[#0d1117] border-t border-[#30363d]">
         {aiLimitReached ? (
            <div className="p-4 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/5 to-transparent text-center">
               <Lock className="w-6 h-6 text-red-400 mx-auto mb-2" />
               <h4 className="text-gray-200 font-medium text-sm mb-1">Weekly Limit Reached</h4>
               <p className="text-gray-500 text-xs mb-3">Upgrade to Premium for unlimited queries.</p>
               <button 
                  onClick={() => setShowPaywall(true)}
                  className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto"
               >
                  <Crown size={14} className="fill-black" /> Get Premium
               </button>
            </div>
         ) : (
            <div className="relative group">
               <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask a question..."
                  rows={1}
                  disabled={loading}
                  className="w-full bg-[#161b22] text-gray-200 text-sm border border-[#30363d] rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 resize-none transition-all placeholder:text-gray-600 disabled:opacity-50"
               />
               
               <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 bottom-2 p-1.5 bg-cyan-600 text-white rounded-lg disabled:bg-[#21262d] disabled:text-gray-600 transition-colors hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 disabled:shadow-none"
               >
                  {loading ? <StopCircle size={16} /> : <CornerDownLeft size={16} />}
               </button>
            </div>
         )}
         
         {!aiLimitReached && (
            <div className="mt-2 text-center">
               <p className="text-[10px] text-gray-600">
                  AI may produce inaccurate information.
               </p>
            </div>
         )}
      </div>

      <PaywallModal 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="AI Chat Queries"
        usage={usageLimits?.aiChatQueries}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #484f58; }
      `}</style>
    </div>
  );
};

export default ChatAi;