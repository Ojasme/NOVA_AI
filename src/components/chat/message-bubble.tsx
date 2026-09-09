import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, FileText, Image } from "lucide-react";

import type { ChatMessage } from "@/hooks/use-nova-chat";
import { MarkdownMessage } from "./markdown-message";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {isUser ? (
        <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-5 py-3 text-[0.95rem] leading-relaxed whitespace-pre-wrap text-primary-foreground shadow-glow sm:max-w-[70%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {message.attachments.map((attachment) => (
                <span
                  key={`${attachment.name}-${attachment.size}`}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-primary-foreground/15 px-2 py-1 text-xs"
                >
                  {attachment.mimeType.startsWith("image/") ? (
                    <Image className="h-3 w-3 shrink-0" />
                  ) : (
                    <FileText className="h-3 w-3 shrink-0" />
                  )}
                  <span className="max-w-40 truncate">{attachment.name}</span>
                </span>
              ))}
            </div>
          )}
          {message.content}
        </div>
      ) : (
        <div className="group w-full max-w-[92%] sm:max-w-[80%]">
          <div className="mb-2 flex items-center gap-2 text-xs tracking-wide text-muted-foreground uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Nova
          </div>
          <MarkdownMessage content={message.content} />
          <button
            type="button"
            onClick={copy}
            aria-label="Copy response"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-accent/60 hover:text-foreground focus-visible:opacity-100"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
