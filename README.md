# AI Portfolio

A modern developer portfolio built to win clients: it shows your projects, syncs your public GitHub repos automatically, and includes an AI assistant that answers visitors' questions about your work.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS 4 · Vercel AI SDK · Vercel

## Make it yours

Edit **`src/data/profile.ts`**: name, role, bio, email, socials, services, skills, featured projects, and `githubUsername`. Everything on the site, and everything the AI assistant knows, comes from this file and your public GitHub repos.

For each featured project, set `liveUrl` (your Vercel deployment) and `repo` (`owner/repo`).

## Languages

The site is available in English, German, French, Spanish, Italian, Dutch and Arabic (`/`, `/de`, `/fr`, …).

- Buttons and headings: `src/i18n/ui.ts`
- Your own content (bio, services, projects): translated by AI into `src/i18n/translations.json`

After editing `src/data/profile.ts`, run `npm run translate`. It runs automatically before every build too. Sentences that haven't been translated yet show in English.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable             | Required          | Purpose                                                          |
| -------------------- | ----------------- | ---------------------------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | One AI key | Free Gemini key from https://aistudio.google.com/apikey (no card). Used first when set. Add it on Vercel too. |
| `AI_GATEWAY_API_KEY` | One AI key        | Vercel AI Gateway (needs a card on the Vercel account). Not needed on Vercel deployments. |
| `AI_MODEL`           | No                | Any AI Gateway model id. Default: `anthropic/claude-sonnet-5.5`. |
| `GITHUB_USERNAME`    | No                | Overrides `githubUsername` in the profile file.                  |
| `GITHUB_TOKEN`       | No                | Raises GitHub API rate limits.                                   |

Without an AI key, the site still works and the chat shows a "contact me directly" message.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new.
3. Enable AI Gateway for the project in the Vercel dashboard (AI tab).

Every push to `main` then deploys automatically.

## Project structure

```
src/
  app/
    page.tsx            Home page (sections + chat widget)
    api/chat/route.ts   AI assistant endpoint (streaming)
  components/           UI sections and the chat widget
  data/profile.ts       ← your content
  lib/github.ts         Cached GitHub repo fetching
  lib/assistant.ts      AI system prompt built from your profile + repos
```
