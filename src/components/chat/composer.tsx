import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

type ComposerProps = {
  disabled: boolean;
  onSend: (text: string) => void;
};

export function Composer({ disabled, onSend }: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  return (
    <div className="glass rounded-3xl p-2 transition-shadow focus-within:shadow-glow">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask Nova anything…"
          aria-label="Message Nova"
          className="max-h-[200px] flex-1 resize-none bg-transparent px-4 py-3 text-[0.95rem] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || value.trim().length === 0}
          aria-label="Send message"
          className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      </div>
      <p className="px-4 pb-1.5 text-[0.7rem] text-muted-foreground">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
