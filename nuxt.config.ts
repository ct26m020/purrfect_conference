// https://nuxt.com/docs/api/configuration/nuxt-config
import conferenceData from './app/data/conference-data.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Rendering-Strategie, siehe docs/schritt2/01-rendering-strategie-adr.md
  nitro: {
    prerender: {
      // Speaker-Profile: SSG
      routes: conferenceData.speakers.map(speaker => `/speakers/${speaker.id}`),
    },
  },

  routeRules: {
    // Session-Detailseiten: ISR, Nuxts `isr` wirkt nur auf Vercel/Netlify
    // auf dem Node-Server ist `swr` dasselbe: gecachte Seite, nach 60 s Neuaufbau im Hintergrund
    '/sessions/**': { swr: 60 },
    // „Mein Programm“: CSR, die Auswahl liegt nur im localStorage des Browsers
    '/my-program': { ssr: false },
  },

  // Auto-Import ohne Pfad-Präfix, damit z. B. features/sessions/SessionCard.vue
  // als <SessionCard> verwendet werden kann (siehe ADR-02).
  components: [{ path: '~/components', pathPrefix: false }],

  // Design Tokens (aus /tokens/tokens.css eingebunden) und globale Basis-Styles
  css: ['~/assets/styles/tokens.css', '~/assets/styles/base.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Purrfect Conference',
      meta: [{ name: 'description', content: 'A purrfect plan for your conference – Programm und persönlicher Konferenzplan.' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Nunito:wght@700;800&display=swap',
        },
      ],
    },
  },
})
