import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Paperclip, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: "Hello! I'm your TaxMind AI Assistant. How can I help you with your GST or Income Tax queries today?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Actual API call
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: messages.map(m => ({ role: m.type, content: m.content }))
        })
      });
      const data = await response.json();
      const botResponse = { 
        id: Date.now() + 1, 
        type: 'bot', 
        content: data.response || "Sorry, I encountered an error." 
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        content: "Error connecting to the tax assistant. Please ensure the backend is running." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col glass-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Bot size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Tax Assistant</h3>
            <p className="text-xs text-emerald-400">Online | AI Powered</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-6 pt-0">
        <div className="relative flex items-center">
          <button type="button" className="absolute left-4 p-2 text-slate-400 hover:text-white transition-colors">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about tax compliance, GST, or filings..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-32 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          <div className="absolute right-4 flex items-center space-x-2">
            <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
              <Mic size={20} />
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 p-2.5 rounded-xl text-white hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-3">
          AI can make mistakes. Please verify important financial decisions with a tax professional.
        </p>
      </form>
    </div>
  );
};

export default ChatInterface;
