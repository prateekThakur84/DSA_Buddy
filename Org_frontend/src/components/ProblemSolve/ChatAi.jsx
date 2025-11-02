import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader, AlertCircle, Check, Copy, Crown, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
  
  // Get subscription status
  const { isPremium, usageLimits, hasLimitReached } = useSubscription();
  const aiLimitReached = !isPremium && hasLimitReached('aiChatQueries');

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        from: "bot",
        text: `Hello! I'm your DSA Tutor for **${problem?.title}**.\n\nAsk me for:\n- 💡 Hints and guidance\n- 🔍 Code review\n- 🎯 Optimal approaches\n- ⚡ Complexity analysis${
          !isPremium ? `\n\n**Free Tier**: ${usageLimits?.aiChatQueries?.remaining || 0}/${usageLimits?.aiChatQueries?.limit || 10} AI queries remaining` : ''
        }`,
      },
    ]);
  }, [problem, isPremium, usageLimits]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Check limit before sending
    if (aiLimitReached) {
      setShowPaywall(true);
      return;
    }

    const userMsg = { from: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const { data } = await axiosClient.post("/ai/chat", {
        messages: [...messages, userMsg],
        problemContext: {
          title: problem.title,
          description: problem.description,
          testCases: problem?.visibleTestCases,
          starterCode: problem?.starterCode,
        },
      });
      setMessages((m) => [...m, { from: "bot", text: data.message }]);
    } catch (err) {
      // Check if error is due to limit reached
      if (err.response?.status === 403 && err.response?.data?.limitReached) {
        setError(err.response.data.message);
        setShowPaywall(true);
      } else {
        setError("AI request failed. Please try again.");
      }
      console.error("Chat error:", err);
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

  const clearChat = () => {
    setError("");
    setMessages([
      {
        from: "bot",
        text: `Chat cleared. How can I help with **${problem?.title}** now?`,
      },
    ]);
  };

  const handleCopy = (codeId, code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyStates((prev) => ({ ...prev, [codeId]: true }));
        setTimeout(() => {
          setCopyStates((prev) => ({ ...prev, [codeId]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700">
      {/* Header with Usage Info */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50">
        <div className="flex items-center space-x-2">
          <Bot className="text-cyan-400" size={20} />
          <span className="text-sm font-semibold text-white">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Usage Badge */}
          {isPremium ? (
            <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1">
              <Crown size={12} className="text-cyan-400" />
              <span className="text-xs font-medium text-white">Unlimited</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1 rounded-full px-3 py-1 border text-xs font-medium ${
              aiLimitReached 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : usageLimits?.aiChatQueries?.remaining <= 2
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}>
              {usageLimits?.aiChatQueries?.remaining || 0}/{usageLimits?.aiChatQueries?.limit || 10}
            </div>
          )}
          
          <button
            onClick={clearChat}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 bg-cyan-500/10 rounded border border-cyan-500/20"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                m.from === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-slate-100 border border-slate-700"
              }`}
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");
                    const codeId = `code-${i}-${Date.now()}`;

                    return !inline && match ? (
                      <div className="relative my-2">
                        <button
                          onClick={() => handleCopy(codeId, codeString)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors z-10"
                          title="Copy code"
                        >
                          {copyStates[codeId] ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} className="text-slate-300" />
                          )}
                        </button>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md text-xs"
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className="bg-slate-700 px-1.5 py-0.5 rounded text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 leading-relaxed text-sm">{children}</p>;
                  },
                  strong({ children }) {
                    return <strong className="font-bold text-cyan-300">{children}</strong>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside mb-2 space-y-1 text-sm">{children}</ul>;
                  },
                  li({ children }) {
                    return <li className="text-sm">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="text-base font-bold text-cyan-300 mb-2">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-sm font-bold text-cyan-300 mb-2">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-sm font-semibold text-cyan-300 mb-1">{children}</h3>;
                  },
                }}
              >
                {m.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <Loader className="animate-spin text-cyan-400" size={18} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2 max-w-sm">
              <AlertCircle className="text-red-400 flex-shrink-0" size={18} />
              <span className="text-xs text-red-300">{error}</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-3 bg-slate-900/50">
        {aiLimitReached ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <Lock className="mx-auto mb-2 text-red-400" size={28} />
            <p className="text-red-300 font-medium text-xs mb-1">AI Chat Limit Reached</p>
            <p className="text-xs text-slate-400 mb-3">
              You've used all {usageLimits?.aiChatQueries?.limit || 10} free AI queries
            </p>
            <button 
              onClick={() => setShowPaywall(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-xs rounded-md hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-cyan-500/20"
            >
              <Crown size={14} />
              Upgrade
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything about this problem..."
                rows={2}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 resize-none text-xs"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors flex items-center justify-center flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </>
        )}
      </div>

      {/* Powered by badge */}
      <div className="px-4 py-1.5 text-center border-t border-slate-700 bg-slate-950/50">
        <span className="text-xs text-slate-600">Powered by Gemini</span>
      </div>

      <PaywallModal 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="AI Chat Queries"
        usage={usageLimits?.aiChatQueries}
      />
    </div>
  );
};

export default ChatAi;