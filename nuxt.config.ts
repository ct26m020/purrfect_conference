// https://nuxt.com/docs/api/configuration/nuxt-config
import conferenceData from './app/data/conference-data.json'

// Laufzeit-Caches für Session- und Speaker-Daten (Aufgabe C, siehe runtimeCaching unten)
// Jeder Build bekommt eigene Cache-Namen. Sonst würde gecachtes HTML nach einem neuen
// Build auf JS-Dateien verweisen, die es nicht mehr gibt, und die Seite wäre ohne Funktion
// Caches älterer Builds löscht app/plugins/offline-cache.client.ts
const OFFLINE_CACHE_VERSION = Date.now().toString(36)
const OFFLINE_CACHE_NAMES = ['sessions-api', 'session-pages', 'speaker-pages']
const offlineCacheName = (name: string) => `${name}-${OFFLINE_CACHE_VERSION}`

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
        {
          // Android schneidet App-Icons rund oder abgerundet zu. Nur ein Kreis mit 80 % Durchmesser
          // bleibt sicher sichtbar, deshalb liegt das Motiv hier verkleinert auf weißer Fläche.
          src: '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    // Keep app-shell and static-asset caching separate from conf data rules
    generateSW: {
      //precache the app shell and local static assets for offline startup
      globPatterns: ['**/*.{html,js,css,ico,png,svg,woff,woff2,ttf,otf}'],
      // speaker pages and payloads are not precached, they use the runtime rules S2/S3 below
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

        // Session- und Speaker-Daten
        // B, Abschnitt 2: „Sessions und Speaker → Cache First“. Die Daten ändern sich nach
        // der Veröffentlichung kaum, im Saal mit schlechtem WLAN zählt die schnelle Antwort.
        // Cache First antwortet aus dem Cache und fragt das Netz nur, wenn noch nichts da ist.
        // Gecacht wird nur Status 200, damit kein Fehler oder 404 im Cache hängen bleibt.
        // Kein Ablaufdatum: Ein abgelaufener Eintrag würde offline sofort fehlen.
        // Bewusst in Kauf genommen (B, Abschnitt 4): Zeitplanänderungen aus Schritt 2 (ISR)
        // erreichen einen Browser mit gefülltem Cache erst nach dem nächsten Build.
        {
          // S1 – Session-API: /api/sessions (Programm, „Mein Programm“) und /api/sessions/:id (Detailseite).
          // „Mein Programm“ wird nur im Browser gerendert und holt die Sessions immer hier.
          urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/api/sessions'),
          handler: 'CacheFirst',
          options: {
            cacheName: offlineCacheName('sessions-api'),
            expiration: { maxEntries: 50 },
            cacheableResponse: { statuses: [200] },
          },
        },
        {
          // S2 – Session-Seiten: /program und /sessions/:id rendert der Server zur Laufzeit (SWR),
          // sie lassen sich also nicht beim Build precachen. Gilt für das HTML und für die
          // _payload.json, die Nuxt bei Navigation innerhalb der App lädt.
          urlPattern: ({ url, sameOrigin }) =>
            sameOrigin && (url.pathname === '/program' || url.pathname.startsWith('/program/') || url.pathname.startsWith('/sessions/')),
          handler: 'CacheFirst',
          options: {
            cacheName: offlineCacheName('session-pages'),
            expiration: { maxEntries: 60 },
            cacheableResponse: { statuses: [200] },
          },
        },
        {
          // S3 – Speaker-Seiten: beim Build vorgerendert (SSG), HTML und _payload.json.
          // Laut B Cache First statt Precache: ein Profil landet im Cache, sobald es einmal geöffnet wurde.
          urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/speakers/'),
          handler: 'CacheFirst',
          options: {
            cacheName: offlineCacheName('speaker-pages'),
            expiration: { maxEntries: 50 },
            cacheableResponse: { statuses: [200] },
          },
        },
      ],
    },
  },

  // Für app/plugins/offline-cache.client.ts: aktuelle Cache-Version und die Seiten,
  // die beim ersten Besuch vorab in den Cache geladen werden
  appConfig: {
    offlineCache: {
      version: OFFLINE_CACHE_VERSION,
      names: OFFLINE_CACHE_NAMES,
      warmUpUrls: ['/api/sessions', '/program'],
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
      meta: [
        { name: 'description', content: 'A purrfect plan for your conference – Programm und persönlicher Konferenzplan.' },
        // Färbt die Adressleiste ein, gleicher Wert wie theme_color im Manifest
        { name: 'theme-color', content: '#213B50' },
      ],
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
