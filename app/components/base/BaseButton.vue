<script setup lang="ts">
defineProps<{ to?: string }>()
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="base-button">
    <slot />
  </NuxtLink>
  <button v-else type="button" class="base-button">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: 999px;
  background-color: var(--color-button-background);
  color: var(--color-button-text);
  font-family: var(--font-heading);
  font-size: var(--text-body);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.base-button:hover {
  background-color: var(--color-border-strong);
}
</style>
