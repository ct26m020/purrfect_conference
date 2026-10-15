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
  box-shadow: 0 2px 8px rgba(33, 59, 80, 0.08);
}
</style>
