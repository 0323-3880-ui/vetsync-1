import React, { useState, useRef, useEffect } from 'react';

// --- Types ---
type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  showBooking?: boolean;
  condition?: string;
};

type Species = '' | 'dog' | 'cat' | 'rabbit' | 'bird' | 'reptile';

export default function AssistiveChatbot() {
  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      type: 'bot',
      text: "Hi there! 👋 I'm ASTRID, your VetSync Assistant.\n\nI can help you with:\n  - Clinic info (booking, hours, services)\n  - Pet health questions (vomiting, limping, diarrhea, etc.)\n\nWhat can I help you with today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<Species>('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Auto Scroll ---
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // --- Constants ---
  const quickReplies = [
    'How to Book Appointment',
    'Clinic Hours',
    'What are the Services?',
    'How to Sign Up',
    'How to Log In',
    'Emergency Contact',
  ];

  const speciesOptions: { id: Species; label: string; icon: string }[] = [
    { id: '', label: 'Any', icon: '🐾' },
    { id: 'dog', label: 'Dog', icon: '🐕' },
    { id: 'cat', label: 'Cat', icon: '🐈' },
    { id: 'rabbit', label: 'Rabbit', icon: '🐇' },
    { id: 'bird', label: 'Bird', icon: '🐦' },
    { id: 'reptile', label: 'Reptile', icon: '🦎' },
  ];

  // --- Handlers ---
  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleSend = async (textToSubmit: string = inputValue) => {
    if (!textToSubmit.trim()) return;

    const userText = textToSubmit.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { id: Date.now().toString(), type: 'user', text: userText }]);
    setIsTyping(true);

    try {
      // Choose endpoint
      const endpoint = selectedSpecies ? '/api/chat/health' : '/api/chat';
      const body = selectedSpecies
        ? { message: userText, species: selectedSpecies }
        : { message: userText };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + '-bot',
            type: 'bot',
            text: data.reply || "I didn't quite catch that.",
            showBooking: data.show_booking && data.type !== 'faq',
            condition: data.condition,
          },
        ]);
      }, 700);
    } catch (error) {
      console.error('Chat error:', error);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + '-error',
            type: 'bot',
            text: "Sorry, I'm having trouble connecting right now. Please try again.",
          },
        ]);
      }, 700);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Helpers ---
  const formatBotMessage = (text: string) => {
    // Basic formatting for the bot strings (headers, warnings, disclaimers, newlines)
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^([A-Z][^:\n]{2,40}:)$/gm, '<strong>$1</strong>')
      .replace(/^  ! (.+)$/gm, '  <span class="text-red-600 font-semibold">⚠ $1</span>')
      .replace(/^-----$/gm, '<hr class="border-t border-sky-200 my-2" />')
      .replace(
        /(This is general guidance only[^\n]+)/g,
        '<em class="text-xs text-gray-500 block mt-1">$1</em>'
      )
      .replace(
        /(Book an appointment[^\n]+)/g,
        '<strong class="text-sky-600 tracking-tight block mt-1">📅 $1</strong>'
      )
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button & Tooltip */}
      {!isOpen && (
        <div className="relative flex items-center justify-end group">
          <div className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-medium py-2 px-4 rounded-xl shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
            Hi! I'm ASTRID — Click to chat
          </div>
          <button
            onClick={toggleChatbot}
            className="w-14 h-14 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat Window */}
      <div
        className={`bg-white w-[380px] max-h-[600px] sm:w-[400px] h-auto flex flex-col rounded-2xl shadow-2xl border border-sky-100 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute bottom-0 right-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0369A1] to-[#0EA5E9] p-4 flex justify-between items-center shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full border-2 border-white/40 flex items-center justify-center shadow-inner overflow-hidden">
              <img src="/static/images/astrid.png" alt="ASTRID Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">ASTRID Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-sky-100 text-xs font-medium">Online • VetSync</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleChatbot}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages Layout */}
        <div className="flex-1 bg-slate-50 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'bot' && (
                <img
                  src="/static/images/astrid.png"
                  alt="ASTRID"
                  className="w-7 h-7 rounded-full border border-sky-200 bg-white mr-2 mt-auto shadow-sm"
                />
              )}
              <div
                className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.type === 'user'
                    ? 'bg-[#0369A1] text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-sm'
                }`}
              >
                {msg.type === 'bot' ? (
                  <div dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.text) }} />
                ) : (
                  msg.text
                )}

                {/* Booking Button Injection */}
                {msg.showBooking && (
                  <a
                    href="/booking"
                    className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5 no-underline"
                  >
                    <span>📅</span> 
                    Book Vet Appointment {selectedSpecies ? `for your ${selectedSpecies}` : ''}
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start items-end">
              <img
                src="/static/images/astrid.png"
                alt="ASTRID"
                className="w-7 h-7 rounded-full border border-sky-200 bg-white mr-2 shadow-sm"
              />
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies section - Max 6 buttons in 2 elegant rows */}
        <div className="bg-white border-t border-slate-100 px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex flex-wrap gap-2 justify-start">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="bg-sky-50 text-[#0369A1] border border-[#BAE6FD] hover:bg-[#BAE6FD] hover:text-[#0284C7] transition-colors rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-tight shadow-sm"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="bg-white border-t border-slate-100 px-4 pb-4 pt-3">
          {/* Species Selector */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 whitespace-nowrap pl-1">
              My pet is a:
            </span>
            <div className="flex gap-1.5">
              {speciesOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSpecies(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSpecies === opt.id
                      ? 'bg-[#0EA5E9] text-white shadow-md shadow-sky-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-sm">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#0EA5E9] focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 rounded-xl transition-all shadow-inner">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={selectedSpecies ? `Ask about your ${selectedSpecies}...` : 'Ask ASTRID anything...'}
              className="w-full bg-transparent border-none py-3 pl-4 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-[#0EA5E9] hover:bg-[#0284C7] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
