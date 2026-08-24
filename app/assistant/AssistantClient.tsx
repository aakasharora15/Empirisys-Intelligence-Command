"use client";

import { useEffect, useState, useRef } from 'react';
import { SFDesktopcomputer as Bot, SFPaperplane as Send, SFBook as BookOpen, SFPerson as User } from 'sf-symbols-lib/monochrome';
import HeroSection from '@/components/ui/HeroSection';
import { EmpirisysKnowledge } from '@/lib/db';
import { cn } from '@/lib/utils';

// Helper to render basic markdown and preserve whitespace
const renderMarkdown = (text: string) => {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    
    // Replace **bold** with strong tags
    const boldRegex = /\*\*(.*?)\*\*/g;
    let htmlLine = line.replace(boldRegex, '<strong class="text-text-primary">$1</strong>');
    
    // Handle Headers
    if (htmlLine.startsWith('### ')) {
      return <h4 key={i} className="text-sm font-bold text-text-primary mt-3 mb-1" dangerouslySetInnerHTML={{ __html: htmlLine.substring(4) }} />;
    }
    if (htmlLine.startsWith('## ')) {
      return <h3 key={i} className="text-sm font-black text-text-primary mt-4 mb-2 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: htmlLine.substring(3) }} />;
    }
    if (htmlLine.startsWith('# ')) {
      return <h2 key={i} className="text-base font-black text-accent mt-4 mb-2" dangerouslySetInnerHTML={{ __html: htmlLine.substring(2) }} />;
    }
    
    return (
      <span key={i} className="block mb-1.5 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: htmlLine }} />
    );
  });
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

interface AssistantClientProps {
  initialKnowledge: EmpirisysKnowledge[];
}

export function AssistantClient({
  initialKnowledge
}: AssistantClientProps) {
  const [knowledgeBase] = useState<EmpirisysKnowledge[]>(initialKnowledge);
  const [activeSectionId, setActiveSectionId] = useState<string>('About');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Removed data fetching useEffect since data is passed as props

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, typedContent]);

  const handleSuggestedQuestion = (qText: string) => {
    setInputText(qText);
    sendMessage(qText);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputText("");
    setIsTyping(true);
    setTypedContent("");

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text,
          moduleType: 'assistant'
        })
      });

      if (!response.ok || !response.body) throw new Error('API Error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setTypedContent(fullText);
      }

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: fullText,
        citations: ["Empirisys AI Analysis"]
      }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Connection to Empirisys AI failed. Please verify API configuration." }]);
    } finally {
      setIsTyping(false);
      setTypedContent("");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const activeKnowledgeSection = knowledgeBase.find(kb => kb.section === activeSectionId);

  return (
    <div className="pb-16 bg-background min-h-screen">
      {/* Hero Header */}
      <HeroSection
        title={
          <span className="flex items-center gap-2">
            <span>Empirisys,</span>
            <span className="text-accent italic font-serif">instantly knowable.</span>
          </span>
        }
        subtitle="Retrieve product facts client case studies and strategic safety framework parameters"
        moduleLabel="MODULE 05 KNOWLEDGE ASSISTANT"
      />

      {/* Main Container */}
      <div className="w-full px-6 md:px-10 mt-16">
        
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Chat (65%) */}
          <div className="lg:col-span-8 glass-card flex flex-col h-[550px]">
            {/* Header */}
            <div className="p-4 border-b border-card-border bg-background/30 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Retrieval Augmented Intelligence RAI
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-micro font-bold uppercase tracking-wider">
                Model Live
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 && !isTyping ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto">
                  <div className="p-4 bg-accent/10 text-accent rounded-full shadow-inner animate-pulse">
                    <Bot className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                      How can I help you today?
                    </h4>
                    <p className="text-xs text-text-secondary">
                      Ask about BOOST natural language features client portfolios or SENSE diagnostics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 w-full">
                    {[
                      "How does the Empirisys 360 framework operate?",
                      "Cross reference our safety metrics against Sphera.",
                      "What is the standard procedure for high-risk audits?"
                    ].map((qText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(qText)}
                        className="p-3 text-left border border-card-border hover:border-accent hover:bg-accent/10 rounded-xl text-xs text-text-primary font-semibold transition-all bg-background/50 shadow-sm"
                      >
                        {qText}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "flex items-start gap-3.5 max-w-[80%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      {/* Avatar */}
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm",
                        msg.role === 'user' ? "bg-[#7C3AED]" : "bg-accent"
                      )}>
                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>

                      <div className="space-y-2">
                        <div className={cn(
                          "p-4 text-xs leading-relaxed shadow-sm overflow-hidden",
                          msg.role === 'user' 
                            ? "bg-accent/10 text-text-primary rounded-2xl rounded-tr-none border border-accent/10 whitespace-pre-wrap" 
                            : "bg-background text-text-secondary rounded-2xl rounded-tl-none border border-card-border"
                        )}>
                          {msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
                        </div>

                        {/* Citations list */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 ml-2">
                            <span className="text-micro font-bold text-text-secondary uppercase tracking-wider">
                              Citations:
                            </span>
                            {msg.citations.map((cit, citIdx) => (
                              <button
                                key={citIdx}
                                onClick={() => {
                                  setActiveSectionId(cit.split(' ')[0])
                                }}
                                className="px-2 py-0.5 bg-card border border-card-border rounded text-micro font-semibold text-accent hover:bg-accent/10 transition-all"
                              >
                                {cit}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && typedContent && (
                    <div className="flex items-start gap-3.5 max-w-[80%]">
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="space-y-2">
                        <div className="p-4 bg-background text-text-secondary rounded-2xl rounded-tl-none border border-card-border text-xs leading-relaxed shadow-sm overflow-hidden">
                          {renderMarkdown(typedContent)}
                          <span className="inline-block h-3.5 w-1 bg-accent animate-pulse ml-0.5 mt-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="p-4 border-t border-card-border bg-card rounded-b-2xl flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything about Empirisys capabilities clients or tools..."
                className="flex-1 bg-background border border-card-border rounded-full pl-5 pr-14 py-3 text-xs text-text-primary focus:outline-none focus:border-accent focus:bg-background transition-all font-sans"
              />
              <button
                type="submit"
                disabled={isTyping || !inputText.trim()}
                className="p-3 bg-accent hover:bg-accent/80 text-white rounded-full transition-all disabled:opacity-50 shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Right Panel: Knowledge Base Index (35%) */}
          <div className="lg:col-span-4 glass-card flex flex-col h-[550px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-card-border bg-background/30 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-text-primary" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Live Knowledge Index
              </span>
            </div>

            {/* Index Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {knowledgeBase.map((item) => {
                const isActive = activeSectionId === item.section;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSectionId(item.section)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col space-y-2",
                      isActive
                        ? "bg-accent/10 border-accent shadow-sm"
                        : "border-card-border hover:bg-background/50 text-text-secondary"
                    )}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={cn(
                        "text-micro font-bold uppercase tracking-wider",
                        isActive ? "text-accent" : "text-text-secondary"
                      )}>
                        {item.type}
                      </span>
                      {isActive && <span className="h-1.5 w-1.5 bg-accent rounded-full" />}
                    </div>
                    <h4 className="text-xs font-bold text-text-primary">
                      {item.title}
                    </h4>
                  </button>
                );
              })}
            </div>

            {/* Bottom active detail panel preview */}
            {activeKnowledgeSection && (
              <div className="p-4 bg-background/80 border-t border-card-border text-xs">
                <span className="text-micro font-bold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Content Preview
                </span>
                <p className="text-caption text-text-primary leading-relaxed line-clamp-3">
                  {activeKnowledgeSection.content}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
