import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { GeminiError, generateReply } from "./gemini.server";

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(50),
});

export type ChatResult = { ok: true; response: string } | { ok: false; error: string };

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }): Promise<ChatResult> => {
    try {
      const response = await generateReply(data.messages);
      return { ok: true, response };
    } catch (error) {
      if (error instanceof GeminiError) return { ok: false, error: error.message };
      return { ok: false, error: "Something went wrong generating a reply." };
    }
  });
