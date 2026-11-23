# Task A – PWA Setup

We chose `@vite-pwa/nuxt` because it works well with Nuxt and automatically handles the manifest and Service Worker registration. This makes the setup easier and requires less code.

Our app is called **Purrfect Conference**, with **Purrfect** as its short name. It starts at `/`, uses German (`de`), and runs in `standalone` mode, making it look more like a normal app.

We used our existing colors: navy (`#213B50`) for the theme and light blue (`#EDF7FC`) for the background. We also added two PNG icons (192×192 and 512×512) to match our branding.
The Service Worker is registered automatically using `injectRegister: 'auto'`. With `autoUpdate`, new versions can be activated automatically.