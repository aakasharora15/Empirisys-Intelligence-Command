'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SFDesktopcomputer as Bot,
  SFPaperplane as Send,
  SFPerson as User,
  SFXmark as CloseIcon,
} from 'sf-symbols-lib/monochrome';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const renderMarkdown = (text: string) => {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;

    const boldRegex = /\*\*(.*?)\*\*/g;
    const htmlLine = line.replace(
      boldRegex,
      '<strong class="text-[var(--color-text-primary)]">$1</strong>',
    );

    if (htmlLine.startsWith('### ')) {
      return (
        <h4
          key={i}
          className="text-sm font-bold text-[var(--color-text-primary)] mt-3 mb-1"
          dangerouslySetInnerHTML={{ __html: htmlLine.substring(4) }}
        />
      );
    }
    if (htmlLine.startsWith('## ')) {
      return (
        <h3
          key={i}
          className="text-sm font-black text-[var(--color-text-primary)] mt-4 mb-2 uppercase tracking-wide"
          dangerouslySetInnerHTML={{ __html: htmlLine.substring(3) }}
        />
      );
    }
    if (htmlLine.startsWith('# ')) {
      return (
        <h2
          key={i}
          className="text-base font-black text-[var(--color-primary)] mt-4 mb-2"
          dangerouslySetInnerHTML={{ __html: htmlLine.substring(2) }}
        />
      );
    }

    return (
      <span
        key={i}
        className="block mb-1.5 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: htmlLine }}
      />
    );
  });
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function GlobalAssistantDrawer() {
  const pathname = usePathname();
  const { isAssistantOpen, setAssistantOpen } = useStore();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, typedContent, isAssistantOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setInputText('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    setTypedContent('');

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          context: `User is currently viewing path: ${pathname}`,
        }),
      });

      const data = await response.json();

      const fullContent = data.response || "I couldn't process that request.";
      let currentLen = 0;

      const typeInterval = setInterval(() => {
        currentLen += 3;
        if (currentLen > fullContent.length) {
          currentLen = fullContent.length;
          clearInterval(typeInterval);
          setIsTyping(false);
          setChatMessages((prev) => [...prev, { role: 'assistant', content: fullContent }]);
          setTypedContent('');
        } else {
          setTypedContent(fullContent.slice(0, currentLen));
        }
      }, 20);
    } catch (err) {
      setIsTyping(false);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'An error occurred.' }]);
    }
  };

  return (
    <AnimatePresence>
      {isAssistantOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAssistantOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] md:w-[450px] bg-card/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-background/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center border border-[var(--color-primary)]/30">
                  <Bot className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)]">
                    Knowledge Assistant
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] font-medium">
                    Context: {pathname}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssistantOpen(false)}
                className="p-2 text-[var(--color-text-muted)] hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
                  <Bot className="h-12 w-12 text-[var(--color-primary)]/50" />
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium max-w-[80%]">
                    I am the Empirisys Command Assistant. I'm connected to the Vector DB and aware
                    of your current context. Ask me anything.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-start gap-3 max-w-[85%]',
                      msg.role === 'user' ? 'ml-auto flex-row-reverse' : '',
                    )}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm',
                        msg.role === 'user' ? 'bg-panel-sec' : 'bg-[var(--color-primary)]',
                      )}
                    >
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    <div
                      className={cn(
                        'p-3.5 text-sm leading-relaxed shadow-sm overflow-hidden',
                        msg.role === 'user'
                          ? 'bg-white/10 text-white rounded-2xl rounded-tr-none border border-white/10 whitespace-pre-wrap'
                          : 'bg-background text-[var(--color-text-secondary)] rounded-2xl rounded-tl-none border border-white/5',
                      )}
                    >
                      {msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
                    </div>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {isTyping && typedContent && (
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-3.5 bg-background text-[var(--color-text-secondary)] rounded-2xl rounded-tl-none border border-white/5 text-sm leading-relaxed shadow-sm overflow-hidden">
                    {renderMarkdown(typedContent)}
                    <span className="inline-block h-3.5 w-1 bg-[var(--color-primary)] animate-pulse ml-0.5 mt-1" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleFormSubmit}
              className="p-4 border-t border-white/5 bg-background/50 flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-card border border-white/10 rounded-full px-5 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]/50 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isTyping || !inputText.trim()}
                className="p-3 bg-[var(--color-primary)] hover:opacity-80 text-[#0c110f] rounded-full transition-all disabled:opacity-50 shadow-md disabled:shadow-none cursor-pointer"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
