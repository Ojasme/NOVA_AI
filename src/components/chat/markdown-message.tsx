import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const MarkdownMessage = memo(function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="space-y-4 text-[0.95rem] leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          h1: ({ children }) => <h1 className="font-display text-xl font-semibold">{children}</h1>,
          h2: ({ children }) => <h2 className="font-display text-lg font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="font-display text-base font-semibold">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent/50 pl-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-3 py-2 text-left font-medium">{children}</th>
          ),
          td: ({ children }) => <td className="border-b border-border/60 px-3 py-2">{children}</td>,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className ?? "");
            const text = String(children).replace(/\n$/, "");

            if (!match) {
              return (
                <code
                  className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="font-mono">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  language={match[1]}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    background: "transparent",
                    padding: "1rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {text}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
