# Project knowledge

Parchi is a Chrome browser sidepanel extension for AI-powered browsing assistance. It pairs a chat UI with tool-driven browser automation.

## Quickstart
- Setup: `npm install`
- Build: `npm run build` (outputs to `dist/`)
- Dev: Load the unpacked extension from `dist/` in `chrome://extensions`
- Test: `npm run test:unit` (31 unit tests)
- Typecheck: `npm run typecheck`
- Lint: `npm run lint` / `npm run lint:fix`

## Architecture
- `background.ts` — Service worker handling AI chat and tool execution
- `content.ts` — Content script injected into pages
- `sidepanel/` — Chat UI (panel.ts entry, modular ui/ components, templates/, styles/)
- `ai/` — AI SDK integration (sdk-client, retry-engine, message handling, compaction)
- `tools/browser-tools.ts` — Tool definitions for browser automation
- `types/` — Shared TypeScript types (runtime-messages, plan)
- `server/` — Optional billing/portal server (separate tsconfig)
- `release/` — Pre-built browser packages (chrome/, firefox/)

Data flow: UI → Background (user_message) → AI Provider (stream) → Background (tool exec) → UI (assistant_response)

## Conventions
- Formatter: Biome (2-space indent, single quotes, semicolons, 120 line width)
- After UI changes, always rebuild (`npm run build`) so `dist/sidepanel/` stays in sync
- ES2022 target, NodeNext modules, strict TypeScript (but noImplicitAny off)
- Chrome extension manifest v3

## Gotchas
- Extension loads from `dist/`, not source — must rebuild after changes
- Server has its own `tsconfig.json` and `package.json` in `server/`
- Biome ignores `dist/`, `node_modules/`, JSON, and Markdown files
