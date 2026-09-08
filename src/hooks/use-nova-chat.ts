import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { sendChatMessage } from "@/lib/chat.functions";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function useNovaChat() {
  const send = useServerFn(sendChatMessage);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = { id: newId(), role: "user", content: trimmed };
      const history = [...messages, userMessage];

      setMessages(history);
      setIsLoading(true);
      setError(null);

      try {
        const result = await send({
          data: { messages: history.map(({ role, content }) => ({ role, content })) },
        });

        if (result.ok) {
          setMessages((prev) => [
            ...prev,
            { id: newId(), role: "assistant", content: result.response },
          ]);
        } else {
          setError(result.error);
        }
      } catch {
        setError("Could not reach the assistant. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, send],
  );

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clear };
}
