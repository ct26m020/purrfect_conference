# Purrfect Conference

Purrfect Conference is a Nuxt 4 prototype for a fictional frontend conference.
It showcases a branded conference landing page, a structured data model for sessions and speakers,
and a foundation for a personal conference planner.

> "A purrfect plan for your conference"

## Features

- Landing page with conference branding and a session count summary
- Central conference data layer
- Shared layout with header and footer
- Design-token based styling and global app theming
- Planned personal program flow with session selection and persistence

## Technologies

- Nuxt 4
- Vue 3
- TypeScript
- CSS design tokens
- JSON-based conference data
- localStorage planned for saving a personal conference program

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

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `app/` – Nuxt application code
  - `assets/styles/` – Global styles and token imports
  - `components/` – Reusable base, feature, and layout components
  - `composables/` – `useConferenceData`, `useSessionFilter`, `useMyProgram`
  - `data/conference-data.json` – Conference sessions, tracks, rooms, and speaker data
  - `layouts/default.vue` – Shared app shell
  - `pages/` – File-based routes such as `index.vue`, `program.vue`, and `my-program.vue`
- `public/` – Static assets
- `tokens/tokens.css` – Shared design tokens
- `docs/schritt1/` – Architecture and planning notes
- `nuxt.config.ts` – Nuxt configuration

## Project Status

The app includes the Nuxt shell, conference data loading, a filterable program view,
and a personal conference planner that stores session selections in `localStorage`.

Current implemented features:
- searchable and filterable program page
- session cards with track, time, room, speaker, and abstract details
- add/remove session actions for a personal program
- persisted personal selections in the browser

The app remains intentionally lightweight and easy to extend for future enhancements such as speaker pages or more advanced planning interactions.
