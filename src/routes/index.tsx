import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, TriangleAlert } from "lucide-react";

import novaMark from "@/assets/nova-mark.png";
import { Composer } from "@/components/chat/composer";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { useNovaChat } from "@/hooks/use-nova-chat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova AI Chatbot — Ask anything, get clear answers" },
      {
        name: "description",
        content:
          "Nova is a fast, elegant AI chat assistant with markdown answers, code highlighting and instant replies. No sign-up required.",
      },
      { property: "og:title", content: "Nova AI Chatbot" },
      {
        property: "og:description",
        content: "A fast, elegant AI chat assistant. Ask anything and get clear, formatted answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NovaChatPage,
});

const SUGGESTIONS = [
  "Explain recursion with a short example",
  "Write a Python script to rename files",
  "Give me a 3-day plan to learn SQL",
  "Summarise the idea of compound interest",
];

function NovaChatPage() {
  const { messages, isLoading, error, sendMessage, clear } = useNovaChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="aurora" aria-hidden="true" />

      <header className="sticky top-0 z-20 border-b border-border/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={novaMark} alt="Nova logo" className="h-8 w-8" />
            <div>
              <h1 className="font-display text-base leading-none font-semibold tracking-tight">
                Nova
              </h1>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">AI assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={isEmpty || isLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear chat
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex-1 space-y-8 py-8">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center pt-10 text-center sm:pt-20"
            >
              <img src={novaMark} alt="" className="h-16 w-16 drop-shadow-[0_0_28px_var(--glow)]" />
              <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                How can I help today?
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Ask a question, paste some code, or start a conversation. Nothing is saved — close the
                tab and it&apos;s gone.
              </p>
              <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="glass rounded-2xl px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:text-foreground hover:shadow-glow"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </AnimatePresence>
          )}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-0 z-20 -mx-4 bg-gradient-to-t from-background via-background to-transparent px-4 pt-4 pb-5 sm:-mx-6 sm:px-6">
          <Composer disabled={isLoading} onSend={sendMessage} />
        </div>
      </main>
    </div>
  );
}
