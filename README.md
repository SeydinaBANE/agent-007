# agent-007

Open source AI chat boilerplate. Clone, configure two environment variables, and you have a fully working chat application in minutes.

## What's included

- **Multi-model chat** — switch between Claude, GPT-4o, Gemini, Llama and more via a dropdown
- **Conversation history** — stored in Supabase, persists across sessions
- **Streaming responses** — token-by-token output via Vercel AI SDK v6
- **Markdown rendering** — assistant responses rendered with full formatting
- **Anonymous sessions** — no login required, each browser gets a UUID
- **Tool-calling ready** — infrastructure in place to add tools in `lib/tools/`

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| AI SDK | Vercel AI SDK v6 (`ai`, `@ai-sdk/react`) |
| Models | OpenRouter (Claude, GPT-4o, Gemini, Llama…) |
| Database | Supabase (Postgres) |
| UI | shadcn/ui · Tailwind CSS v4 |
| Language | TypeScript |

## Quick start

**1. Clone and install**

```bash
git clone https://github.com/your-username/agent-007.git
cd agent-007
npm install
```

**2. Configure environment**

```bash
cp .env.example .env
```

Edit `.env`:

```
OPENROUTER_API_KEY=sk-or-v1-...        # openrouter.ai/keys
NEXT_PUBLIC_SUPABASE_URL=https://...   # your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...      # your Supabase anon/publishable key
```

**3. Create database tables**

In your Supabase project → SQL Editor, run the contents of [`supabase/migration.sql`](./supabase/migration.sql).

**4. Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding models

Edit `lib/models.ts` to add or remove models. Any model available on OpenRouter works.

```ts
{ id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral' },
```

## Adding tools

Create a file in `lib/tools/` and register it in the `tools` option of `streamText` in `app/api/chat/route.ts`.

```ts
// lib/tools/search.ts
import { tool } from 'ai'
import { z } from 'zod'

export const searchTool = tool({
  description: 'Search the web',
  parameters: z.object({ query: z.string() }),
  execute: async ({ query }) => { /* ... */ },
})
```

## Deploy

Works on Vercel out of the box. Add the three environment variables in your project settings and deploy.

## License

MIT
