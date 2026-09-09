import { useEffect, useRef, useState } from "react";
import { ArrowUp, FileText, ImagePlus, Paperclip, X } from "lucide-react";

import type { ChatAttachment } from "@/hooks/use-nova-chat";

type ComposerProps = {
  disabled: boolean;
  onSend: (text: string, attachments?: ChatAttachment[]) => void;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILES = [
  "image/*",
  "application/pdf",
  ".txt",
  ".md",
  ".csv",
  ".json",
  ".html",
  ".xml",
  ".doc",
  ".docx",
].join(",");

const readAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read that file."));
        return;
      }
      resolve(result.split(",", 2)[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });

export function Composer({ disabled, onSend }: ComposerProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if ((!text && attachments.length === 0) || disabled) return;
    onSend(text, attachments);
    setValue("");
    setAttachments([]);
  };

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFileError(null);

    const selected = Array.from(files);
    if (selected.some((file) => file.size > MAX_FILE_SIZE)) {
      setFileError("Each file must be smaller than 10 MB.");
      return;
    }
    if (attachments.length + selected.length > 5) {
      setFileError("You can attach up to 5 files per message.");
      return;
    }

    try {
      const nextAttachments = await Promise.all(
        selected.map(async (file) => ({
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          data: await readAsBase64(file),
          size: file.size,
        })),
      );
      setAttachments((current) => [...current, ...nextAttachments]);
    } catch {
      setFileError("Could not read one of those files. Please try again.");
    }
  };

  return (
    <div className="glass rounded-3xl p-2 transition-shadow focus-within:shadow-glow">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 pt-2">
          {attachments.map((attachment) => (
            <div
              key={`${attachment.name}-${attachment.size}`}
              className="flex max-w-full items-center gap-2 rounded-xl border border-border bg-muted/60 px-2.5 py-1.5 text-xs"
            >
              {attachment.mimeType.startsWith("image/") ? (
                <ImagePlus className="h-3.5 w-3.5 shrink-0 text-accent" />
              ) : (
                <FileText className="h-3.5 w-3.5 shrink-0 text-accent" />
              )}
              <span className="max-w-44 truncate">{attachment.name}</span>
              <button
                type="button"
                onClick={() =>
                  setAttachments((current) => current.filter((item) => item !== attachment))
                }
                aria-label={`Remove ${attachment.name}`}
                className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILES}
          multiple
          className="hidden"
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach images or documents"
          title="Attach images or documents"
          className="mb-1 ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <Paperclip className="h-4 w-4" />
        </button>
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
      {fileError && <p className="px-4 pt-1 text-xs text-destructive">{fileError}</p>}
      <p className="px-4 pb-1.5 text-[0.7rem] text-muted-foreground">
        Attach images or documents · Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
