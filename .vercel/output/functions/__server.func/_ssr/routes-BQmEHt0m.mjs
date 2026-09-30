import { i as __toESM } from "../_runtime.mjs";
import { E as isRedirect, g as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Dq-3FFnT.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { a as Image, c as Copy, i as Paperclip, l as Check, n as TriangleAlert, o as ImagePlus, r as RotateCcw, s as FileText, t as X, u as ArrowUp } from "../_libs/lucide-react.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
import { n as highlighter, t as one_dark_default } from "../_libs/react-syntax-highlighter+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BQmEHt0m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var nova_mark_default = "/assets/nova-mark-C5vJZgEL.png";
var MAX_FILE_SIZE = 10485760;
var ACCEPTED_FILES = [
	"image/*",
	"application/pdf",
	".txt",
	".md",
	".csv",
	".json",
	".html",
	".xml",
	".doc",
	".docx"
].join(",");
var readAsBase64 = (file) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => {
		const result = reader.result;
		if (typeof result !== "string") {
			reject(/* @__PURE__ */ new Error("Could not read that file."));
			return;
		}
		resolve(result.split(",", 2)[1] ?? "");
	};
	reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that file."));
	reader.readAsDataURL(file);
});
function Composer({ disabled, onSend }) {
	const [value, setValue] = (0, import_react.useState)("");
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const [fileError, setFileError] = (0, import_react.useState)(null);
	const textareaRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
	}, [value]);
	const submit = () => {
		const text = value.trim();
		if (!text && attachments.length === 0 || disabled) return;
		onSend(text, attachments);
		setValue("");
		setAttachments([]);
	};
	const addFiles = async (files) => {
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
			const nextAttachments = await Promise.all(selected.map(async (file) => ({
				name: file.name,
				mimeType: file.type || "application/octet-stream",
				data: await readAsBase64(file),
				size: file.size
			})));
			setAttachments((current) => [...current, ...nextAttachments]);
		} catch {
			setFileError("Could not read one of those files. Please try again.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-3xl p-2 transition-shadow focus-within:shadow-glow",
		children: [
			attachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 px-2 pt-2",
				children: attachments.map((attachment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-w-full items-center gap-2 rounded-xl border border-border bg-muted/60 px-2.5 py-1.5 text-xs",
					children: [
						attachment.mimeType.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-3.5 w-3.5 shrink-0 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 shrink-0 text-accent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-44 truncate",
							children: attachment.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAttachments((current) => current.filter((item) => item !== attachment)),
							"aria-label": `Remove ${attachment.name}`,
							className: "rounded-full p-0.5 text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})
					]
				}, `${attachment.name}-${attachment.size}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: ACCEPTED_FILES,
						multiple: true,
						className: "hidden",
						onChange: (event) => {
							addFiles(event.target.files);
							event.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => fileInputRef.current?.click(),
						disabled,
						"aria-label": "Attach images or documents",
						title: "Attach images or documents",
						className: "mb-1 ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						ref: textareaRef,
						rows: 1,
						value,
						onChange: (e) => setValue(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								submit();
							}
						},
						placeholder: "Ask Nova anything…",
						"aria-label": "Message Nova",
						className: "max-h-[200px] flex-1 resize-none bg-transparent px-4 py-3 text-[0.95rem] text-foreground placeholder:text-muted-foreground focus:outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: submit,
						disabled: disabled || value.trim().length === 0,
						"aria-label": "Send message",
						className: "mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4.5 w-4.5" })
					})
				]
			}),
			fileError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pt-1 text-xs text-destructive",
				children: fileError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-1.5 text-[0.7rem] text-muted-foreground",
				children: "Attach images or documents · Enter to send · Shift + Enter for a new line"
			})
		]
	});
}
var MarkdownMessage = (0, import_react.memo)(function MarkdownMessage({ content }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4 text-[0.95rem] leading-relaxed text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
			remarkPlugins: [remarkGfm],
			components: {
				p: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap",
					children
				}),
				a: ({ children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					...props,
					target: "_blank",
					rel: "noreferrer",
					className: "text-accent underline underline-offset-4",
					children
				}),
				ul: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc space-y-1 pl-5",
					children
				}),
				ol: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "list-decimal space-y-1 pl-5",
					children
				}),
				h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl font-semibold",
					children
				}),
				h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children
				}),
				h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold",
					children
				}),
				blockquote: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
					className: "border-l-2 border-accent/50 pl-4 text-muted-foreground",
					children
				}),
				table: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full text-sm",
						children
					})
				}),
				th: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border-b border-border px-3 py-2 text-left font-medium",
					children
				}),
				td: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "border-b border-border/60 px-3 py-2",
					children
				}),
				code: ({ className, children, ...props }) => {
					const match = /language-(\w+)/.exec(className ?? "");
					const text = String(children).replace(/\n$/, "");
					if (!match) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-accent",
						...props,
						children
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: match[1]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(highlighter, {
							language: match[1],
							style: one_dark_default,
							customStyle: {
								margin: 0,
								background: "transparent",
								padding: "1rem",
								fontSize: "0.85rem"
							},
							children: text
						})]
					});
				}
			},
			children: content
		})
	});
});
function MessageBubble({ message }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const isUser = message.role === "user";
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(message.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .28,
			ease: "easeOut"
		},
		className: `flex w-full ${isUser ? "justify-end" : "justify-start"}`,
		children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-5 py-3 text-[0.95rem] leading-relaxed whitespace-pre-wrap text-primary-foreground shadow-glow sm:max-w-[70%]",
			children: [message.attachments && message.attachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex flex-wrap gap-1.5",
				children: message.attachments.map((attachment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex max-w-full items-center gap-1.5 rounded-lg bg-primary-foreground/15 px-2 py-1 text-xs",
					children: [attachment.mimeType.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3 w-3 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "max-w-40 truncate",
						children: attachment.name
					})]
				}, `${attachment.name}-${attachment.size}`))
			}), message.content]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group w-full max-w-[92%] sm:max-w-[80%]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2 text-xs tracking-wide text-muted-foreground uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }), "Nova"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownMessage, { content: message.content }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: copy,
					"aria-label": "Copy response",
					className: "mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-accent/60 hover:text-foreground focus-visible:opacity-100",
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copied" : "Copy"]
				})
			]
		})
	});
}
function TypingIndicator() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			children: [
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				className: "h-1.5 w-1.5 rounded-full bg-accent",
				animate: {
					opacity: [
						.25,
						1,
						.25
					],
					y: [
						0,
						-3,
						0
					]
				},
				transition: {
					duration: 1.1,
					repeat: Infinity,
					delay: i * .15
				}
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nova is thinking" })]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var sendChatMessage = createServerFn({ method: "POST" }).inputValidator((input) => ChatInput.parse(input)).handler(createSsrRpc("abb0f390d0d9d5c002c238029f7d6ac7eceb5f795c2ff0103d4fb2cfd687a422"));
var newId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
function useNovaChat() {
	const send = useServerFn(sendChatMessage);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	return {
		messages,
		isLoading,
		error,
		sendMessage: (0, import_react.useCallback)(async (text, attachments = []) => {
			const trimmed = text.trim();
			if (!trimmed && attachments.length === 0 || isLoading) return;
			const userMessage = {
				id: newId(),
				role: "user",
				content: trimmed || "Please review the attached files.",
				...attachments.length > 0 ? { attachments } : {}
			};
			const history = [...messages, userMessage];
			setMessages(history);
			setIsLoading(true);
			setError(null);
			try {
				const result = await send({ data: { messages: history.map(({ role, content, attachments: messageAttachments }) => ({
					role,
					content,
					...messageAttachments ? { attachments: messageAttachments } : {}
				})) } });
				if (result.ok) setMessages((prev) => [...prev, {
					id: newId(),
					role: "assistant",
					content: result.response
				}]);
				else setError(result.error);
			} catch {
				setError("Could not reach the assistant. Please try again.");
			} finally {
				setIsLoading(false);
			}
		}, [
			isLoading,
			messages,
			send
		]),
		clear: (0, import_react.useCallback)(() => {
			setMessages([]);
			setError(null);
		}, [])
	};
}
var SUGGESTIONS = [
	"Explain recursion with a short example",
	"Write a Python script to rename files",
	"Give me a 3-day plan to learn SQL",
	"Summarise the idea of compound interest"
];
function NovaChatPage() {
	const { messages, isLoading, error, sendMessage, clear } = useNovaChat();
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [messages, isLoading]);
	const isEmpty = messages.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aurora",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border/60 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: nova_mark_default,
							alt: "Nova logo",
							className: "h-8 w-8"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-base leading-none font-semibold tracking-tight",
							children: "Nova"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[0.7rem] text-muted-foreground",
							children: "AI assistant"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: clear,
						disabled: isEmpty || isLoading,
						className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground disabled:opacity-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Clear chat"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-8 py-8",
					children: [
						isEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 16
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .4 },
							className: "flex flex-col items-center justify-center pt-10 text-center sm:pt-20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: nova_mark_default,
									alt: "",
									className: "h-16 w-16 drop-shadow-[0_0_28px_var(--glow)]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display mt-6 text-3xl font-semibold tracking-tight sm:text-4xl",
									children: "How can I help today?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-md text-sm text-muted-foreground",
									children: "Ask a question, paste some code, or start a conversation. Nothing is saved — close the tab and it's gone."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 grid w-full gap-2.5 sm:grid-cols-2",
									children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => sendMessage(s),
										className: "glass rounded-2xl px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:text-foreground hover:shadow-glow",
										children: s
									}, s))
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							initial: false,
							children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, { message: m }, m.id))
						}),
						isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypingIndicator, {}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky bottom-0 z-20 -mx-4 bg-gradient-to-t from-background via-background to-transparent px-4 pt-4 pb-5 sm:-mx-6 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
						disabled: isLoading,
						onSend: sendMessage
					})
				})]
			})
		]
	});
}
//#endregion
export { NovaChatPage as component };
