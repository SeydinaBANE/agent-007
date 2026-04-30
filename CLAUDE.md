# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Next.js 16 Breaking Changes

This project runs **Next.js 16.2.4** — a version with breaking changes from training data. **Always read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js-specific code.** Key sections:

- `01-app/` — App Router (used here, not Pages Router)
- `01-app/02-guides/` — Feature guides (caching, navigation, auth, etc.)
- `01-app/03-api-reference/` — Directives, components, functions, config

Notable changes to be aware of:
- **`cacheComponents`** flag in `next.config.ts` changes how data fetching and caching work. When enabled, data fetching is uncached by default; use the `use cache` directive explicitly.
- **Instant navigation** requires exporting `unstable_instant` from routes — `Suspense` alone is not sufficient. See `01-app/02-guides/instant-navigation.md`.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (radix-nova) · Vercel AI SDK v6 · Supabase · OpenRouter

**App Router layout:**
```
app/
  api/chat/route.ts               — POST: streaming chat, saves messages to Supabase
  api/conversations/route.ts      — GET list, POST create
  api/conversations/[id]/route.ts — GET (with messages), DELETE
  chat/layout.tsx                 — layout with Sidebar
  chat/page.tsx                   — auto-creates a new conversation and redirects
  chat/[id]/page.tsx              — main chat UI (client component)
components/chat/
  sidebar.tsx        — conversation list, new chat button, delete
  messages.tsx       — renders UIMessage[] with react-markdown for assistant
  input.tsx          — textarea with Enter-to-send
  model-selector.tsx — shadcn Select over MODELS list
lib/
  supabase.ts        — Supabase client (anon key, works client + server)
  models.ts          — MODELS array + DEFAULT_MODEL (edit to add/remove models)
  anonymous-id.ts    — getAnonymousId() reads/writes UUID from localStorage
supabase/
  migration.sql      — run once in Supabase SQL editor to create tables
```

**AI SDK v6 patterns (breaking changes from v5):**
- `useChat` is from `@ai-sdk/react`, NOT `ai/react`
- Return values: `{ messages, sendMessage, status, setMessages }` — no `input`/`handleSubmit`
- `messages` are `UIMessage[]` with `parts` array, not `{ role, content }` strings
- Transport: `new DefaultChatTransport({ api, body })` from `ai`
- Server: use `convertToModelMessages(messages)` (async) then `streamText`, return `result.toUIMessageStreamResponse()`
- `status` is `'idle' | 'submitted' | 'streaming' | 'error'`

**Supabase schema:** `conversations(id, title, model, anonymous_id, created_at, updated_at)` + `messages(id, conversation_id, role, content, created_at)`. RLS enabled with public access policies (no auth).

**Identity without auth:** `getAnonymousId()` generates a UUID on first visit and stores it in `localStorage`. All conversations and sidebar fetches are scoped to this ID.

**Tailwind v4:** No `tailwind.config.js`. Theme customization goes in `app/globals.css` under `@theme inline { ... }`.

**Adding models:** edit `lib/models.ts` — any OpenRouter model ID works.

**Adding tools:** create a file in `lib/tools/`, add to the `tools` option in `app/api/chat/route.ts`.
