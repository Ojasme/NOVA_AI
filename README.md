# Nova AI Chatbot

Nova is a focused AI chat assistant built with React and TanStack Start. Users can send messages,
receive replies from Google Gemini, and read responses rendered with Markdown and syntax-highlighted
code. Conversations are kept in memory for the current session only: there are no accounts, database
records, or stored chat histories.

## Important: create your own API key

The project needs a Google Gemini API key to generate replies. Each user or deployment owner must
create and use their own key:

1. Open [Google AI Studio API keys](https://aistudio.google.com/apikey).
2. Sign in and create an API key.
3. Copy `.env.example` to `.env` in the project directory.
4. Replace the placeholder value with your key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Never commit `.env`, publish the key in frontend code, or share it publicly. The application reads
the key on the server only, and `.env` is ignored by Git.

## Features

- Google Gemini responses with full conversation context
- Markdown rendering and syntax highlighting for fenced code blocks
- Copy assistant responses
- Clear the current conversation
- Typing indicator and automatic scrolling
- Responsive interface for desktop and mobile
- Server-side validation and readable error handling for missing keys, rejected keys, rate limits,
  and upstream failures

## How it works

```text
Browser (React 19)
   |
   | sendChatMessage({ messages })
   v
TanStack Start server function
   | validates input with Zod
   v
Gemini server client
   | reads GEMINI_API_KEY
   v
Google Gemini API
   |
   v
Markdown response rendered in the browser
```

The main server flow is implemented in `src/lib/chat.functions.ts` and
`src/lib/gemini.server.ts`. The API key never needs to be exposed as a `VITE_*` variable and should
never be placed in a client component.

## Technology and dependencies

### Runtime dependencies

- `react`, `react-dom` — UI rendering
- `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/react-query` — routing, server
  rendering, and application data patterns
- `vite` — development server and build tool
- `zod` — server input validation
- `react-markdown`, `remark-gfm` — Markdown and GitHub-flavored Markdown rendering
- `react-syntax-highlighter` — code block syntax highlighting
- `lucide-react` — interface icons
- `framer-motion` — interface animations
- `@radix-ui/*` — accessible UI primitives
- `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css`, `class-variance-authority`, `clsx`,
  `tailwind-merge` — styling and component variants
- `react-hook-form`, `@hookform/resolvers` — form handling and validation integration
- `sonner` — toast notifications
- `date-fns`, `embla-carousel-react`, `cmdk`, `vaul`, `react-resizable-panels`, `recharts`, and
  `input-otp` — reusable UI components included in the project

### Development dependencies

- `typescript` and React/Node type packages — type checking
- `@vitejs/plugin-react` — React support in Vite
- `@tanstack/router-plugin` and `vite-tsconfig-paths` — route generation and path aliases
- `eslint`, `typescript-eslint`, and related plugins — linting
- `prettier` and `eslint-config-prettier` — formatting
- `nitro` and `@lovable.dev/vite-tanstack-config` — server build and deployment integration

## Project structure

```text
src/
  components/chat/             Chat composer, messages, Markdown, and loading state
  components/ui/               Reusable Radix-based UI components
  hooks/use-nova-chat.ts       In-memory conversation state
  lib/chat.functions.ts        Validated server function for chat requests
  lib/gemini.server.ts         Server-only Gemini client and error mapping
  routes/__root.tsx            Document shell and application metadata
  routes/index.tsx             Main chat screen
  styles.css                   Global styles and design tokens
```

## Local development

Requirements:

- Node.js 20 or newer, or Bun
- npm, or Bun
- A Gemini API key in `.env`

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080).

With Bun, the equivalent commands are:

```bash
bun install
bun run dev
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Google Gemini Developer API key, read only on the server |
| `PORT` | No | Port used by the server; the local Vite default is `8080` |
| `HOST` | No | Host interface used by the server |

## Available scripts

```bash
npm run dev      # Start the local development server
npm run build    # Create a production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
npm run format   # Format the project with Prettier
```

## Docker

Make sure `.env` contains your own `GEMINI_API_KEY`, then run:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Docker passes the key to the server
container; it is not bundled into browser assets.

## API contract

Chat uses a typed TanStack Start server function instead of a hand-written REST endpoint:

```ts
sendChatMessage({
  data: { messages: [{ role: "user", content: "Hello" }] },
});

// { ok: true, response: "..." }
// { ok: false, error: "..." }
```

## Security notes

- Use a separate API key for each environment where practical.
- Restrict and rotate keys through Google AI Studio if a key is exposed.
- Do not prefix the key with `VITE_`; Vite exposes those variables to the browser.
- Do not commit `.env` or include the key in screenshots, logs, or issue reports.

## Possible future improvements

- Token streaming for word-by-word replies
- Multiple chat threads with optional persistence
- File and image input
- Regenerate or edit-and-resend controls
- Per-session rate limiting
