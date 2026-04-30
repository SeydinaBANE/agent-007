# agent-007

Boilerplate open source pour créer une application de chat AI en quelques minutes. Clone, configure 3 variables d'environnement, c'est prêt.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)

## Ce que tu obtiens

- **Multi-modèles** — bascule entre Claude, GPT-4o, Gemini, Llama via un menu déroulant
- **Historique persisté** — conversations sauvegardées dans Supabase, accessibles après rechargement
- **Streaming** — réponses affichées token par token
- **Rendu Markdown** — le formatage de l'assistant (listes, gras, code…) est rendu proprement
- **Sessions anonymes** — aucune inscription requise, chaque navigateur reçoit un UUID automatique
- **Prêt pour les tools** — infrastructure en place pour ajouter des fonctions dans `lib/tools/`

## Stack

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 App Router |
| AI SDK | Vercel AI SDK v6 (`ai`, `@ai-sdk/react`) |
| Modèles | OpenRouter — Claude, GPT-4o, Gemini, Llama… |
| Base de données | Supabase (Postgres) |
| UI | shadcn/ui · Tailwind CSS v4 |
| Langage | TypeScript |

## Démarrage rapide

**Prérequis :** Node.js 18+, un compte [OpenRouter](https://openrouter.ai), un projet [Supabase](https://supabase.com).

**1. Cloner et installer**

```bash
git clone https://github.com/SeydinaBANE/agent-007.git
cd agent-007
npm install
```

**2. Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Remplis `.env` :

```env
OPENROUTER_API_KEY=sk-or-v1-...              # openrouter.ai/keys
NEXT_PUBLIC_SUPABASE_URL=https://...         # URL de ton projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=...            # Clé anon de ton projet Supabase
```

**3. Créer les tables en base**

Dans ton projet Supabase → SQL Editor, exécute le contenu de [`supabase/migration.sql`](./supabase/migration.sql).

**4. Lancer**

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Ajouter un modèle

Édite `lib/models.ts`. N'importe quel modèle disponible sur OpenRouter fonctionne.

```ts
{ id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral' },
```

## Ajouter un tool (fonction AI)

Crée un fichier dans `lib/tools/` et enregistre-le dans l'option `tools` de `streamText` dans `app/api/chat/route.ts`.

```ts
// lib/tools/meteo.ts
import { tool } from 'ai'
import { z } from 'zod'

export const meteoTool = tool({
  description: 'Donne la météo pour une ville',
  parameters: z.object({ ville: z.string() }),
  execute: async ({ ville }) => {
    // appel API météo ici
    return { temperature: '24°C', condition: 'Ensoleillé' }
  },
})
```

## Déploiement

Compatible Vercel nativement. Ajoute les 3 variables d'environnement dans **Settings → Environment Variables** et déploie.

## Problème connu

Si tu utilises `@ai-sdk/openai` v3+, appelle `.chat()` explicitement pour forcer l'endpoint `/chat/completions` — OpenRouter ne supporte pas encore l'endpoint `/responses` :

```ts
// ✅ correct
model: openrouter.chat('anthropic/claude-sonnet-4-5')

// ❌ déclenche une erreur 400 sur OpenRouter
model: openrouter('anthropic/claude-sonnet-4-5')
```

## Contribuer

Les PRs sont les bienvenues. Ouvre une issue pour discuter d'une nouvelle fonctionnalité avant de coder.

## Licence

MIT
