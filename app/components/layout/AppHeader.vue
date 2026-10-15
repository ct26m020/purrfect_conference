<template>
  <header class="app-header">
    <NuxtLink to="/" class="app-header__brand">🐱 Purrfect Conference</NuxtLink>
    <nav class="app-header__nav" aria-label="Hauptnavigation">
      <NuxtLink to="/">Start</NuxtLink>
      <NuxtLink to="/program">Programm</NuxtLink>
      <NuxtLink to="/my-program">Mein Programm</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-page);
  background-color: var(--color-surface);
  border-bottom: 2px solid var(--color-surface-accent);
}

.app-header__brand {
  font-family: var(--font-heading);
  font-size: var(--text-card-title);
  font-weight: 800;
  color: var(--color-text-primary);
  text-decoration: none;
}

.app-header__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.app-header__nav a {
  padding: var(--space-1) var(--space-2);
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-weight: 600;
  text-decoration: none;
}

.app-header__nav a.router-link-active {
  background-color: var(--color-surface-accent);
  color: var(--color-text-primary);
}
</style>
