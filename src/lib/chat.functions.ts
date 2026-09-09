import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { GeminiError, generateReply } from "./gemini.server";

const AttachmentInput = z.object({
  name: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(128),
  data: z.string().min(1).max(14_000_000),
  size: z.number().int().positive().max(10_000_000),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
        attachments: z.array(AttachmentInput).max(5).optional(),
      }),
    )
    .min(1)
    .max(100),
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
