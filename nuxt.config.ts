// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
