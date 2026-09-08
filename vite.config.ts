// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Load a local .env into process.env so `bun run dev` picks up GEMINI_API_KEY.
// (Hosted environments inject their own secrets and have no .env file.)
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (!match || line.trim().startsWith("#")) continue;
    const key = match[1]!;
    if (process.env[key] === undefined) {
      process.env[key] = match[2]!.replace(/^["']|["']$/g, "");
    }
  }
}

// Outside Lovable (e.g. local Docker), set NITRO_PRESET=node-server to build a
// plain Node server at dist/server/index.mjs. Inside Lovable this stays untouched.
const localPreset = process.env["NITRO_PRESET"];

export default defineConfig({
  ...(localPreset ? { nitro: { preset: localPreset } } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
