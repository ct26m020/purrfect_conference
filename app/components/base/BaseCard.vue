<template>
  <article class="base-card">
    <slot />
  </article>
</template>

<style scoped>
.base-card {
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: var(--space-card);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: box-shadow 0.2s ease-in-out;
}

.base-card:hover {
  box-shadow: 0 4px 16px var(--color-shadow-hover);
}
</style>
