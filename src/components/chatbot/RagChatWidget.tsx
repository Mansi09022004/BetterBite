import { useState, useRef, useEffect, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, Sparkles } from 'lucide-react';

// The chatbot UI. This component only ever talks to /api/rag-chat — all the
// retrieval/embedding/vector-search logic lives server-side (api/rag-chat.ts)
// so no Supabase or Gemini keys are ever exposed to the browser.

interface Source {
  chunkIndex: number;
  similarity: number;
  snippet: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  isError?: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm the BetterBite Assistant. Ask me about our bites, nutrition, subscriptions, or policies.",
};

function SourcesToggle({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-cocoa-400 hover:text-cocoa-600"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        View sources ({sources.length})
      </button>
      {open && (
        <div className="mt-1.5 space-y-1.5 rounded-lg bg-cocoa-600/5 p-2">
          {sources.map((s) => (
            <div key={s.chunkIndex} className="text-[11px] leading-snug text-cocoa-500">
              <span className="font-semibold text-cocoa-600">
                Chunk #{s.chunkIndex} · similarity {s.similarity.toFixed(2)}
              </span>
              <p className="mt-0.5">{s.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RagChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong.');
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: data.answer, sources: data.sources ?? [] },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label={isOpen ? 'Close BetterBite Assistant' : 'Open BetterBite Assistant'}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cocoa-600 text-cream-100 shadow-lift"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed bottom-24 right-5 z-40 flex h-[70vh] max-h-[560px] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl2 border border-cocoa-600/10 bg-cream-100 shadow-lift"
          >
            <div className="flex items-center gap-2 bg-cocoa-600 px-4 py-3 text-cream-100">
              <Sparkles className="h-4 w-4 text-gold-300" />
              <div>
                <p className="font-display text-sm font-bold leading-tight">BetterBite Assistant</p>
                <p className="text-[11px] leading-tight text-cream-100/70">Answers grounded in our product docs</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[88%]'}>
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm leading-snug ${
                      m.role === 'user'
                        ? 'bg-cocoa-600 text-cream-100'
                        : m.isError
                          ? 'bg-berry/10 text-berry'
                          : 'bg-beige-100 text-cocoa-700'
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === 'assistant' && m.sources && <SourcesToggle sources={m.sources} />}
                </div>
              ))}

              {isLoading && (
                <div className="mr-auto max-w-[60%] rounded-2xl bg-beige-100 px-3 py-2 text-sm text-cocoa-400">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cocoa-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cocoa-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cocoa-400" />
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-cocoa-600/10 p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about BetterBite..."
                className="flex-1 rounded-full border border-cocoa-600/15 bg-white px-3.5 py-2 text-sm text-cocoa-700 outline-none focus:border-cocoa-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa-600 text-cream-100 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
