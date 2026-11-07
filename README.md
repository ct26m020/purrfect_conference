# Purrfect Conference

Purrfect Conference is a Nuxt 4 prototype for a fictional frontend conference.
It showcases a branded conference landing page, a structured data model for sessions and speakers,
and a foundation for a personal conference planner.

> "A purrfect plan for your conference"

## Features

- Landing page with conference branding and a session count summary
- Searchable and filterable program page
- Session detail pages and speaker profiles
- Personal program ("Mein Programm") persisted in `localStorage`
- Rendering strategy per route (SSG, ISR, CSR)
- Central conference data layer
- Shared layout with header and footer
- Design-token based styling and global app theming

## Technologies

- Nuxt 4
- Vue 3
- TypeScript
- CSS design tokens
- JSON-based conference data
- Nitro server routes as a simulated backend
- localStorage for saving the personal conference program

## Requirements

Before starting, make sure you have installed:

- Node.js (version 22.21 or newer, as required by Nuxt 4)
- npm
- Git (optional, for cloning the repository)

## Setup

**1. Clone or download the repository**

Open the project folder in VS Code.

**2. Open a terminal in the project folder**

Make sure the terminal is located in the repository root (the folder containing `package.json`).

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

```text
http://localhost:3000
```

## Build

To create a production build:

```bash
npm run build
```

To start the production server locally:

```bash
npm run preview
```

The app is then available at `http://localhost:3000`. Alternatively, the server can be started directly with `node .output/server/index.mjs`.

> Do not use `npm run generate` for this project. It renders every page as a static file, so the session pages and the program page would lose their ISR behaviour and the API routes would not be available.

## Rendering Strategy

Each part of the app uses its own rendering strategy. The reasoning is documented in `docs/schritt2/01-rendering-strategie-adr.md`.

| Route | Strategy | Configuration in `nuxt.config.ts` |
|---|---|---|
| `/speakers/:id` | SSG | `nitro.prerender.routes` |
| `/sessions/:id` | ISR (regenerated after 60 s) | `routeRules: { swr: 60 }` |
| `/program` | ISR + client-side filtering | `routeRules: { swr: 60 }` |
| `/my-program` | CSR | `routeRules: { ssr: false }` |

Nuxt's `isr` option only takes effect on platforms like Vercel or Netlify. On the Node server, `swr` provides the same behaviour.

Session data is served at runtime by Nitro server routes in `server/`, which act as a simulated backend:

- `GET /api/sessions` – all sessions
- `GET /api/sessions/:id` – a single session
- `POST /api/simulate/schedule-change` – moves a session's start and end time

## Simulating a Schedule Change (ISR)

ISR can be observed reliably with the production server only. In dev mode, the page cache is stored in `.nuxt/cache` and survives restarts, while the simulated schedule is reset on every restart.

1. Build and start the production server: `npm run build`, then `npm run preview`
2. Open `http://localhost:3000/sessions/s01` once, so the page gets cached
3. Move session `s01` by 30 minutes in a second terminal:

   PowerShell:

   ```powershell
   Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/simulate/schedule-change -ContentType 'application/json' -Body '{"id":"s01","minutes":30}'
   ```

   bash:

   ```bash
   curl -X POST http://localhost:3000/api/simulate/schedule-change -H "Content-Type: application/json" -d '{"id":"s01","minutes":30}'
   ```

4. Reload the page: it still shows the old time, because it is served from the cache
5. Wait 60 seconds and reload twice: the first reload triggers the regeneration, the second one shows the new time

`/program` behaves the same way. The response headers of both pages contain `cache-control: s-maxage=60, stale-while-revalidate`. Simulated changes are kept in memory and reset when the server restarts.

## Project Structure

- `app/` – Nuxt application code
  - `assets/styles/` – Global styles and token imports
  - `components/` – Reusable base, feature, and layout components
  - `composables/` – `useConferenceData`, `useSessionFilter`, `useMyProgram`
  - `data/conference-data.json` – Conference sessions, tracks, rooms, and speaker data
  - `layouts/default.vue` – Shared app shell
  - `pages/` – File-based routes such as `index.vue`, `program.vue`, `my-program.vue`, `sessions/[id].vue`, and `speakers/[id].vue`
- `server/` – Nitro server routes
  - `api/` – Session API and schedule-change simulation
  - `utils/schedule.ts` – In-memory schedule used as a simulated backend
- `public/` – Static assets
- `tokens/tokens.css` – Shared design tokens
- `docs/schritt1/` – Architecture and planning notes
- `docs/schritt2/` – Rendering strategy ADR and AI logs
- `nuxt.config.ts` – Nuxt configuration

## Project Status

The app includes the Nuxt shell, conference data loading, a filterable program view,
and a personal conference planner that stores session selections in `localStorage`.

Current implemented features:
- searchable and filterable program page (track, day, level)
- session cards with track, time, room, speaker, and abstract details
- session detail pages and speaker profiles
- add/remove session actions for a personal program
- persisted personal selections in the browser
- rendering strategy per route with a simulated schedule change for ISR

The app remains intentionally lightweight and easy to extend for future enhancements such as more advanced planning interactions.
