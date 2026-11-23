// https://nuxt.com/docs/api/configuration/nuxt-config
import conferenceData from './app/data/conference-data.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],

  pwa: {
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    includeManifest: false,
    includeManifestIcons: false,
    manifest: {
      name: 'Purrfect Conference',
      short_name: 'Purrfect',
      description: 'A purrfect plan for your conference',
      start_url: '/',
      scope: '/',
      lang: 'de',
      display: 'standalone',
      theme_color: '#213B50',
      background_color: '#EDF7FC',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    // Keep app-shell and static-asset caching separate from conf data rules
    generateSW: {
      //precache the app shell and local static assets for offline startup
      globPatterns: ['**/*.{html,js,css,ico,png,svg,woff,woff2,ttf,otf}'],
      // Flo: speaker pages and payloads 
      globIgnores: ['speakers/**', '**/_payload.json'],
      globStrict: false,
      navigateFallback: null,
      runtimeCaching: [
        {
          // pls doublecheck: cache Google Fonts after first use - no local font files exist yet
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },

  // Rendering-Strat
  nitro: {
    prerender: {
      // statically render the routes needed for offline app-shell startp
      routes: ['/', '/my-program', ...conferenceData.speakers.map(speaker => `/speakers/${speaker.id}`)],
    },
  },

  routeRules: {
    // Session-Detailseiten: ISR, Nuxts `isr` wirkt nur auf Vercel/Netlify
    // auf dem Node-Server ist `swr` dasselbe: gecachte Seite, nach 60 s Neuaufbau im Hintergrund
    '/sessions/**': { swr: 60 },
    // Session-Übersicht: ISR mit demselben Intervall, die Filter laufen per CSR im Browser
    '/program': { swr: 60 },
    // „Mein Programm“: CSR, die Auswahl liegt nur im localStorage des Browsers
    '/my-program': { ssr: false },
  },

  experimental: {
    // Daten beim ersten Laden direkt ins HTML, damit Seite und Daten aus demselben
    // Cache-Eintrag kommen. Nur Klicks innerhalb der App nutzen die _payload.json.
    payloadExtraction: 'client',
  },

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
