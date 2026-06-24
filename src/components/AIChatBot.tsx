import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello! I am your BANTConfirm AI Business Consultant. I can help you find and qualify the best CRM, ERP, Cloud Telephony, or Cyber Security solutions for your business.\n\nTell me: What software or IT requirement are you sourcing today?",
      createdAt: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts] = useState([
    "I need a CRM for 50 employees.",
    "Which ERP is better: SAP or Odoo?",
    "Suggest cloud telephony with call recording.",
    "What is the budget for CrowdStrike endpoint security?"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) setInput("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatHistory: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to consult AI");
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: "model",
        text: data.text || "I am processing your requirement. Could you please elaborate on your timeline?",
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "model",
        text: "I experienced a connection lag. However, based on BANT guidelines, we recommend putting in a formal requirement form on our dashboard so we can match you with verified Gold partners immediately.",
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <motion.button
        id="btn-ai-chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-colors relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 text-[10px] font-bold text-slate-950 items-center justify-center">AI</span>
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="panel-ai-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-[420px] max-w-[calc(100vw-2rem)] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1.5 text-white">
                    BANTConfirm AI Consultant
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  </h4>
                  <p className="text-xs text-slate-300">Enterprise Sourcing Expert</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Message on server persistence */}
            <div className="bg-blue-50/70 px-4 py-2 text-[11px] text-blue-800 border-b border-blue-100 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Answers qualified using automatic BANT criteria matching.
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-100' : 'bg-slate-800'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-[#0066FF] text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 shadow-xs rounded-tl-none whitespace-pre-line'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="p-3 rounded-xl text-sm bg-white text-slate-400 border border-slate-100 shadow-xs rounded-tl-none flex items-center gap-1.5">
                      Consulting BANT catalog
                      <span className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-slate-100 bg-white">
                <p className="text-xs text-slate-400 mb-2 font-medium">Suggested Sourcing Queries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-all text-left cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask about CRM, ERP, pricing, timelines..."
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-9 h-9 bg-[#0066FF] hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
