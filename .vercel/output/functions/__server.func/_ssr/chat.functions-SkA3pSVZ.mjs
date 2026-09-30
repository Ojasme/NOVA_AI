import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat.functions-SkA3pSVZ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
var SYSTEM_INSTRUCTION = "You are Nova, a thoughtful and concise AI assistant. Answer clearly, use markdown for structure, and use fenced code blocks with a language tag for code.";
var GeminiError = class extends Error {
	status;
	constructor(message, status = 502) {
		super(message);
		this.name = "GeminiError";
		this.status = status;
	}
};
async function generateReply(history) {
	const apiKey = process.env["GEMINI_API_KEY"];
	if (!apiKey) throw new GeminiError("The AI key is not configured yet. Add GEMINI_API_KEY to continue.", 500);
	const body = {
		systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
		contents: history.map((turn) => ({
			role: turn.role === "assistant" ? "model" : "user",
			parts: [{ text: turn.content }, ...(turn.attachments ?? []).map((attachment) => ({ inlineData: {
				mimeType: attachment.mimeType,
				data: attachment.data
			} }))]
		})),
		generationConfig: {
			temperature: .7,
			maxOutputTokens: 2048
		}
	};
	let response;
	try {
		response = await fetch(GEMINI_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey
			},
			body: JSON.stringify(body)
		});
	} catch {
		throw new GeminiError("Could not reach the AI service. Please try again.", 503);
	}
	if (!response.ok) {
		const detail = await response.text().catch(() => "");
		if (response.status === 429) throw new GeminiError("Too many requests right now. Please wait a moment.", 429);
		if (response.status === 401 || response.status === 403) throw new GeminiError("The AI key was rejected. Please check it and try again.", 401);
		throw new GeminiError(detail.slice(0, 300) || "The AI service returned an error.", response.status >= 500 ? 502 : 400);
	}
	const text = ((await response.json()).candidates?.[0]?.content?.parts ?? []).map((part) => part.text ?? "").join("").trim();
	if (!text) throw new GeminiError("The AI returned an empty response. Try rephrasing.", 502);
	return text;
}
var AttachmentInput = objectType({
	name: stringType().min(1).max(255),
	mimeType: stringType().min(1).max(128),
	data: stringType().min(1).max(14e6),
	size: numberType().int().positive().max(1e7)
});
var ChatInput = objectType({ messages: arrayType(objectType({
	role: enumType(["user", "assistant"]),
	content: stringType().min(1).max(8e3),
	attachments: arrayType(AttachmentInput).max(5).optional()
})).min(1).max(100) });
var sendChatMessage_createServerFn_handler = createServerRpc({
	id: "abb0f390d0d9d5c002c238029f7d6ac7eceb5f795c2ff0103d4fb2cfd687a422",
	name: "sendChatMessage",
	filename: "src/lib/chat.functions.ts"
}, (opts) => sendChatMessage.__executeServer(opts));
var sendChatMessage = createServerFn({ method: "POST" }).inputValidator((input) => ChatInput.parse(input)).handler(sendChatMessage_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			response: await generateReply(data.messages)
		};
	} catch (error) {
		if (error instanceof GeminiError) return {
			ok: false,
			error: error.message
		};
		return {
			ok: false,
			error: "Something went wrong generating a reply."
		};
	}
});
//#endregion
export { sendChatMessage_createServerFn_handler };
