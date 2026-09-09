/**
 * Server-only Gemini client.
 * The API key is read from the environment and never leaves the server.
 */

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION =
  "You are Nova, a thoughtful and concise AI assistant. " +
  "Answer clearly, use markdown for structure, and use fenced code blocks with a language tag for code.";

export type ChatAttachment = {
  name: string;
  mimeType: string;
  data: string;
  size: number;
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
};

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

export async function generateReply(history: ChatTurn[]): Promise<string> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new GeminiError("The AI key is not configured yet. Add GEMINI_API_KEY to continue.", 500);
  }

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [
        { text: turn.content },
        ...(turn.attachments ?? []).map((attachment) => ({
          inlineData: { mimeType: attachment.mimeType, data: attachment.data },
        })),
      ],
    })),
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  };

  let response: Response;
  try {
    response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    });
  } catch {
    throw new GeminiError("Could not reach the AI service. Please try again.", 503);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 429) {
      throw new GeminiError("Too many requests right now. Please wait a moment.", 429);
    }
    if (response.status === 401 || response.status === 403) {
      throw new GeminiError("The AI key was rejected. Please check it and try again.", 401);
    }
    throw new GeminiError(
      detail.slice(0, 300) || "The AI service returned an error.",
      response.status >= 500 ? 502 : 400,
    );
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new GeminiError("The AI returned an empty response. Try rephrasing.", 502);
  }

  return text;
}
